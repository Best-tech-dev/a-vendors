import { type Page, type Locator, expect } from "@playwright/test";

/**
 * Page Object Model for the /dashboard route.
 *
 * The dashboard is a protected route. Its layout component (app/(dashboard)/layout.tsx)
 * renders `null` until two conditions are met:
 *   1. `_hasHydrated` is true  — Zustand has finished reading from localStorage.
 *   2. `token` is non-null     — the user is authenticated.
 *
 * For this POM's assertions to pass end-to-end, the preceding OTP verification
 * mock must have returned a valid `access_token`, causing the verify page's
 * `setAuth(token, user)` call to populate the Zustand store in-memory.
 * Since Next.js client-side navigation preserves the JS context, the token
 * remains available when the dashboard layout evaluates its guards.
 *
 * SELECTOR STRATEGY
 * -----------------
 * The dashboard page (app/(dashboard)/dashboard/page.tsx) renders static mock
 * data from top-vendors.ts, not live API data. Selectors target text and roles
 * that are guaranteed to be present after a successful render.
 *
 *  - `getByRole('heading', { name: 'Dashboard' })` — the primary H1 rendered
 *    by DashboardPage and used as the definitive "page loaded" indicator.
 *  - `getByText('Welcome back!')` — the descriptive subtitle present on load.
 *  - `getByRole('button', { name: 'Add team member' })` — the prominent CTA.
 */
export class DashboardPage {
  readonly page: Page;

  // ── Locators ──────────────────────────────────────────────────────────────

  /**
   * Primary H1 heading.
   * Defined in dashboard/page.tsx: <h1 ...>Dashboard</h1>
   * Used as the canonical "dashboard has rendered" signal.
   */
  readonly heading: Locator;

  /**
   * The descriptive welcome subtitle beneath the heading.
   * `exact: false` allows a partial text match — resilient to punctuation or
   * whitespace variations without coupling to the exact full string.
   */
  readonly welcomeText: Locator;

  /**
   * "Add team member" button in the header area.
   * A secondary assertion target confirming the full page tree has rendered.
   */
  readonly addTeamMemberButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", {
      name: "Dashboard",
      exact: true,
    });
    this.welcomeText = page.getByText("Welcome back!", { exact: false });
    this.addTeamMemberButton = page.getByRole("button", {
      name: "Add team member",
    });
  }

  // ── Assertions ─────────────────────────────────────────────────────────────

  /**
   * Assert the dashboard has fully rendered after successful authentication.
   *
   * Assertions are intentionally layered:
   *  1. `toHaveURL` — verifies the router completed the push to /dashboard.
   *  2. `heading.toBeVisible()` — verifies the React component tree mounted and
   *     the layout guard (`token && hasHydrated`) passed.
   *  3. `welcomeText.toBeVisible()` — secondary confirmation of page content.
   *
   * All assertions are web-first and auto-retrying. No `waitForTimeout()` is used.
   */
  async assertLoaded(): Promise<void> {
    // Retries until Next.js router.push('/dashboard') resolves the navigation.
    await expect(this.page).toHaveURL(/\/dashboard/);
    // Retries until the dashboard layout's hydration guard passes and the
    // component tree mounts.
    await expect(this.heading).toBeVisible();
    await expect(this.welcomeText).toBeVisible();
  }
}
