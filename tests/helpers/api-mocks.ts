import { type Page, type Route } from "@playwright/test";

// ── Mock Fixture Data ─────────────────────────────────────────────────────────
// All test data is centralised here. Test files import these constants so that
// assertion values always stay in sync with what the mocks return — a single
// source of truth.

/** Credentials used by the happy-path test. */
export const MOCK_CREDENTIALS = {
  email: "vendor@example.com",
  password: "SecurePass123!",
} as const;

/** The OTP code the mocked verification endpoint will "accept". */
export const MOCK_OTP = "123456";

/**
 * A synthetic, plausible-looking JWT string.
 * This is NEVER validated — it is only checked for presence in the Zustand
 * store. Never use a real token in tests.
 */
export const MOCK_AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dGVzdC1wYXlsb2Fk.mock-sig";

/**
 * Synthetic user object returned inside the OTP verification response.
 * Shape matches the `AuthUser` interface in lib/stores/auth-store.ts.
 */
export const MOCK_USER = {
  id: "user-001",
  email: MOCK_CREDENTIALS.email,
  name: "Test Vendor",
  role: "admin",
} as const;

/**
 * Synthetic user profile returned by the profile endpoint.
 * Shape matches the `UserProfile` interface in types/profile.ts.
 * Used so the dashboard header renders without triggering a clearAuth() call.
 */
export const MOCK_PROFILE = {
  id: "user-001",
  first_name: "Test",
  last_name: "Vendor",
  username: "testvendor",
  email: MOCK_CREDENTIALS.email,
  phone_number: null,
  company_position: "Executive",
  display_picture: null,
  role: "admin",
  status: "active",
  is_active: true,
  is_email_verified: true,
} as const;

// ── Route Mock Helpers ────────────────────────────────────────────────────────
//
// INTERCEPTION STRATEGY
// ---------------------
// Playwright's page.route() registers a handler at the CDP (Chrome DevTools
// Protocol) layer. Matching requests are fulfilled locally — they NEVER reach
// the network. This guarantees:
//   - Zero real HTTP traffic out of the browser
//   - Zero database reads or writes
//   - Zero email dispatches
//   - Deterministic, instant responses
//
// All URL patterns use a leading **/ glob so they match regardless of the
// NEXT_PUBLIC_API_BASE_URL value set in the environment. The axios instance
// (lib/api/axios.ts) uses that env var as its baseURL, meaning the full URL
// will vary per environment. The glob approach makes the mocks environment-agnostic.
//
// All handlers check route.request().method() to only intercept the HTTP verb
// used by the application code, passing all other methods (e.g., OPTIONS
// preflight, unexpected GETs) through with route.continue().

/**
 * Mock: POST /auth/sign-in — returns 200 OK (OTP dispatch simulated).
 *
 * The sign-in page (app/(auth)/sign-in/page.tsx) calls authApi.signIn() and,
 * on success, calls setPendingEmail(email) then router.push('/verify'). It
 * does NOT read any specific field from the response body. A truthy 200 is
 * sufficient to trigger the navigation.
 *
 * Without this mock: real credentials would be validated (or rejected) by a
 * production/staging database and a real OTP email would be sent — both
 * unacceptable side-effects in an automated test suite.
 */
export async function mockSignIn(page: Page): Promise<void> {
  await page.route("**/auth/sign-in", async (route: Route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "OTP sent to your email",
        }),
      });
    } else {
      await route.continue();
    }
  });
}

/**
 * Mock: POST /auth/admin-verify-login-otp — returns 200 OK with a mock token.
 *
 * RESPONSE SHAPE RATIONALE
 * The verify page (app/(auth)/verify/page.tsx) destructures the response as:
 *
 *   const responseData = res.data.data ?? res.data;
 *   const accessToken = responseData.access_token ?? responseData.token;
 *   const user = responseData.user ?? { id: '', email: pendingEmail, ... };
 *
 * We nest the payload under `.data` to satisfy the primary branch of that
 * conditional. On a successful response, the page calls:
 *
 *   setAuth(accessToken, user)
 *
 * which writes the token + user to the Zustand store (in-memory) and to
 * localStorage (via zustand/persist). The subsequent router.push('/dashboard')
 * is a client-side navigation — the same JS context is preserved, so the
 * Zustand store retains the token for the dashboard layout guard to read.
 */
export async function mockVerifyOtp(page: Page): Promise<void> {
  await page.route("**/auth/admin-verify-login-otp", async (route: Route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "OTP verified successfully",
          data: {
            access_token: MOCK_AUTH_TOKEN,
            user: MOCK_USER,
          },
        }),
      });
    } else {
      await route.continue();
    }
  });
}

/**
 * Mock: GET /avendor/user/profile — returns a synthetic user profile.
 *
 * WHY THIS MOCK IS CRITICAL
 * The dashboard layout (app/(dashboard)/layout.tsx) calls profileApi.get()
 * on mount. Without this mock, the request would carry MOCK_AUTH_TOKEN to
 * a non-existent (or wrong-environment) server and likely receive a 401.
 *
 * The axios response interceptor (lib/api/axios.ts) handles 401 responses by
 * calling clearAuth() + window.location = '/sign-in'. This would log the
 * user out and redirect away from /dashboard, causing the test to fail.
 *
 * This mock short-circuits that failure path, allowing the header to render
 * the profile data gracefully.
 *
 * Response shape matches UserProfileResponse in types/profile.ts.
 */
export async function mockGetProfile(page: Page): Promise<void> {
  await page.route("**/avendor/user/profile", async (route: Route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Profile fetched successfully",
          statusCode: 200,
          data: MOCK_PROFILE,
        }),
      });
    } else {
      await route.continue();
    }
  });
}

/**
 * Convenience function: registers ALL three route mocks required for the
 * complete Sign In → OTP → Dashboard happy-path flow in a single call.
 *
 * IMPORTANT: Call this BEFORE any page.goto(). Playwright registers route
 * handlers asynchronously against the browser context. They must be in place
 * before the navigation that triggers the first intercepted request fires,
 * otherwise the real network request may escape.
 *
 * @example
 *   test.beforeEach(async ({ page }) => {
 *     await setupAuthFlowMocks(page);
 *   });
 */
export async function setupAuthFlowMocks(page: Page): Promise<void> {
  await mockSignIn(page);
  await mockVerifyOtp(page);
  await mockGetProfile(page);
}
