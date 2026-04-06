/**
 * @file auth-flow.spec.ts
 *
 * End-to-End test suite for the Sign In → OTP Verification → Dashboard flow.
 *
 * ARCHITECTURE OVERVIEW
 * ─────────────────────
 * ┌─────────────────────────────────────────────────────────────┐
 * │  auth-flow.spec.ts   (orchestrates, asserts)                │
 * │    ↓ imports                                                │
 * │  tests/pages/LoginPage.ts     (sign-in UI actions)         │
 * │  tests/pages/OtpPage.ts       (OTP UI actions)             │
 * │  tests/pages/DashboardPage.ts (dashboard assertions)       │
 * │    ↓ mocks registered via                                   │
 * │  tests/helpers/api-mocks.ts   (page.route() interceptors)  │
 * └─────────────────────────────────────────────────────────────┘
 *
 * MOCKING STRATEGY
 * ────────────────
 * All API calls are intercepted at the CDP (Chrome DevTools Protocol) layer
 * using Playwright's page.route(). Requests are fulfilled locally — no
 * traffic leaves the browser, guaranteeing zero database mutations.
 *
 * Routes are registered in beforeEach() BEFORE the first page.goto() so
 * that no request can escape before a handler is in place.
 *
 * For negative tests, individual route handlers are registered per-test
 * with error responses (4xx). Because Playwright processes route handlers
 * in LIFO order (last registered wins), a test-level handler overrides any
 * earlier beforeEach-level registration for the same URL pattern.
 *
 * ASSERTION POLICY
 * ────────────────
 * Every assertion uses Playwright's web-first API (expect(locator).toBeVisible(),
 * expect(page).toHaveURL(), etc.). These are auto-retrying and timeout-bound —
 * no page.waitForTimeout() calls appear anywhere in this file.
 */

import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { OtpPage } from "./pages/OtpPage";
import { DashboardPage } from "./pages/DashboardPage";
import {
  setupAuthFlowMocks,
  mockSignIn,
  MOCK_CREDENTIALS,
  MOCK_OTP,
} from "./helpers/api-mocks";

// =============================================================================
// HAPPY PATH — Full sign-in → OTP → dashboard flow
// =============================================================================

test.describe("Auth Flow — Happy Path", () => {
  /**
   * Register ALL three mocks before every test in this describe block.
   * This covers: POST /auth/sign-in, POST /auth/admin-verify-login-otp,
   * and GET /avendor/user/profile (critical — prevents the axios 401
   * interceptor from clearing auth and redirecting away from /dashboard).
   */
  test.beforeEach(async ({ page }) => {
    await setupAuthFlowMocks(page);
  });

  // ─── Individual Step Assertions ─────────────────────────────────────────────

  test("sign-in page renders the correct heading and all form fields", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    // assertIsLoaded checks URL, heading, email input, password input, button.
    await loginPage.assertIsLoaded();
  });

  test("submitting valid credentials navigates to the OTP verification page", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const otpPage = new OtpPage(page);

    await loginPage.goto();

    // The mocked POST /auth/sign-in returns 200, triggering:
    //   setPendingEmail(email) + router.push('/verify')
    await loginPage.submitCredentials(
      MOCK_CREDENTIALS.email,
      MOCK_CREDENTIALS.password,
    );

    // Web-first URL assertion — auto-retries until router.push('/verify') resolves.
    await expect(page).toHaveURL(/\/verify/);
    await otpPage.assertIsLoaded();
  });

  test("OTP page displays the pending email set during sign-in", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const otpPage = new OtpPage(page);

    await loginPage.goto();
    await loginPage.submitCredentials(
      MOCK_CREDENTIALS.email,
      MOCK_CREDENTIALS.password,
    );
    await expect(page).toHaveURL(/\/verify/);

    // The verify page reads `pendingEmail` from the Zustand store (set during
    // sign-in) and passes it to InputGroupInput as a readonly value.
    // assertPendingEmailDisplayed targets the `input[readonly]` element.
    await otpPage.assertPendingEmailDisplayed(MOCK_CREDENTIALS.email);
  });

  test("entering the correct OTP code navigates to the dashboard", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const otpPage = new OtpPage(page);
    const dashboardPage = new DashboardPage(page);

    // ── Step 1: Authenticate ────────────────────────────────────────────────
    await loginPage.goto();
    await loginPage.submitCredentials(
      MOCK_CREDENTIALS.email,
      MOCK_CREDENTIALS.password,
    );
    await expect(page).toHaveURL(/\/verify/);

    // ── Step 2: Verify OTP ──────────────────────────────────────────────────
    // The mocked POST /auth/admin-verify-login-otp returns:
    //   { data: { access_token: MOCK_AUTH_TOKEN, user: MOCK_USER } }
    // The verify page destructures this, calls setAuth(token, user), and
    // calls router.push('/dashboard'). The token is now live in Zustand memory.
    await otpPage.enterAndSubmit(MOCK_OTP);

    // ── Step 3: Confirm dashboard ───────────────────────────────────────────
    // assertLoaded() checks toHaveURL(/\/dashboard/) + heading + welcome text.
    await dashboardPage.assertLoaded();
  });

  // ─── Canonical End-to-End Scenario ─────────────────────────────────────────

  test("complete happy-path: sign in → verify OTP → reach dashboard", async ({
    page,
  }) => {
    /**
     * This is the primary E2E test that exercises the entire authentication
     * flow in a single scenario with an explicit assertion at each stage.
     * It serves as the canonical regression test for the auth flow.
     */
    const loginPage = new LoginPage(page);
    const otpPage = new OtpPage(page);
    const dashboardPage = new DashboardPage(page);

    // ── 1. Land on the sign-in page ─────────────────────────────────────────
    await loginPage.goto();
    await expect(page).toHaveURL(/\/sign-in/);
    await expect(loginPage.heading).toBeVisible();

    // ── 2. Submit valid credentials ─────────────────────────────────────────
    await loginPage.submitCredentials(
      MOCK_CREDENTIALS.email,
      MOCK_CREDENTIALS.password,
    );
    // Playwright auto-retries this URL check until the navigation completes.
    await expect(page).toHaveURL(/\/verify/);
    await expect(otpPage.heading).toBeVisible();

    // ── 3. Enter and submit the OTP code ────────────────────────────────────
    await otpPage.enterAndSubmit(MOCK_OTP);

    // ── 4. Assert the protected dashboard rendered ──────────────────────────
    // All three assertions inside assertLoaded() are web-first and auto-retrying.
    // The dashboard layout guard (`token && hasHydrated`) is satisfied because:
    //  a) setAuth() was called with MOCK_AUTH_TOKEN in the verify step above.
    //  b) _hasHydrated was set to true by onRehydrateStorage on the initial load.
    //  c) Client-side navigation (router.push) preserves the Zustand in-memory state.
    await dashboardPage.assertLoaded();
  });
});

// =============================================================================
// NEGATIVE / ERROR STATES
// =============================================================================

test.describe("Auth Flow — Error States", () => {
  // Note: no shared beforeEach here. Each negative test registers only the
  // specific mock(s) it needs, keeping the scope intentionally narrow.

  test("displays an error toast when sign-in credentials are rejected", async ({
    page,
  }) => {
    /**
     * Register a 401 response for the sign-in endpoint only.
     * No other mocks are needed — we never leave /sign-in in this test.
     *
     * The sign-in page catches the AxiosError and calls:
     *   toast.error(axiosError.response?.data?.message || fallback)
     */
    await page.route("**/auth/sign-in", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 401,
          contentType: "application/json",
          body: JSON.stringify({
            success: false,
            message: "Invalid email or password",
          }),
        });
      } else {
        await route.continue();
      }
    });

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.submitCredentials(MOCK_CREDENTIALS.email, "wrong-password");

    /**
     * Sonner (the toast library in use) renders each notification as an
     * <li data-sonner-toast> element inside its toaster portal.
     * We target that attribute to assert the error message text.
     */
    await expect(page.locator("[data-sonner-toast]")).toContainText(
      "Invalid email or password",
    );
    // The URL must not have changed — user stays on the sign-in page.
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test("displays an error toast when the OTP code is rejected", async ({
    page,
  }) => {
    /**
     * Sign-in succeeds (so we can navigate to /verify), but OTP verification
     * returns 400. The verify page catches the error and calls toast.error().
     */
    await mockSignIn(page); // success — allows navigation to /verify

    await page.route("**/auth/admin-verify-login-otp", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify({
            success: false,
            message: "Invalid OTP. Please check and try again.",
          }),
        });
      } else {
        await route.continue();
      }
    });

    const loginPage = new LoginPage(page);
    const otpPage = new OtpPage(page);

    await loginPage.goto();
    await loginPage.submitCredentials(
      MOCK_CREDENTIALS.email,
      MOCK_CREDENTIALS.password,
    );
    await expect(page).toHaveURL(/\/verify/);

    // Submit a deliberately incorrect OTP; the mock returns 400.
    await otpPage.enterAndSubmit("000000");

    await expect(page.locator("[data-sonner-toast]")).toContainText(
      "Invalid OTP",
    );
    // The user must remain on the verify page — no redirect to dashboard.
    await expect(page).toHaveURL(/\/verify/);
  });

  test("redirects unauthenticated users away from /verify to /sign-in", async ({
    page,
  }) => {
    /**
     * Simulate a user directly visiting /verify without going through sign-in.
     *
     * In a fresh browser context (Playwright default), localStorage is empty,
     * so the Zustand auth store initialises with token=null and pendingEmail=null.
     * Once _hasHydrated becomes true (after onRehydrateStorage fires), the
     * useEffect guard in VerifyPage evaluates:
     *
     *   if (hasHydrated && !pendingEmail && !token) router.replace('/sign-in')
     *
     * This test verifies that guard works for direct URL access.
     * No API mocks are needed — the guard fires before any API call.
     */
    await page.goto("/verify");
    await expect(page).toHaveURL(/\/sign-in/);
  });
});
