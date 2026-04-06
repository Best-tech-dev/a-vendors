import { type Page, type Locator, expect } from "@playwright/test";

/**
 * Page Object Model for the /sign-in route.
 *
 * Encapsulates all locators and user-facing actions for the login form,
 * keeping the spec file free of raw selectors.
 *
 * SELECTOR STRATEGY
 * -----------------
 * This project uses a custom FormLabel component (components/ui/form.tsx) that
 * renders a plain <label> WITHOUT a `htmlFor` attribute unless explicitly
 * passed. Because no `htmlFor`/`id` pairing exists, `page.getByLabel()` is
 * unreliable for these inputs.
 *
 * Instead we use:
 *  - `getByPlaceholder()` for inputs — each placeholder is unique and is
 *    defined directly in the JSX, making it a stable contract.
 *  - `getByRole('button', { name })` for the submit CTA — role + accessible
 *    name is the most resilient button selector.
 *  - `getByRole('heading', { name })` for the H1 — a semantic landmark.
 */
export class LoginPage {
  readonly page: Page;

  // ── Locators ──────────────────────────────────────────────────────────────

  /**
   * Email <input> — identified by its placeholder attribute.
   * Defined in sign-in/page.tsx: <Input placeholder="e.g., name@company.com" />
   */
  readonly emailInput: Locator;

  /**
   * Password <input> inside the PasswordInput wrapper component.
   * PasswordInput spreads {...props} onto its inner <input>, so the
   * placeholder="••••••" defined in JSX reaches the rendered <input>.
   */
  readonly passwordInput: Locator;

  /**
   * Primary submit button — targeted by accessible role + visible text.
   * The button text changes to "Signing in..." while loading, so we target
   * the initial state used before any click.
   */
  readonly submitButton: Locator;

  /** H1 heading — a reliable page-loaded assertion landmark. */
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder("e.g., name@company.com");
    this.passwordInput = page.getByPlaceholder("••••••");
    this.submitButton = page.getByRole("button", { name: "Sign in" });
    this.heading = page.getByRole("heading", {
      name: "Welcome Back to the Floor",
    });
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /** Navigate to the /sign-in page. */
  async goto(): Promise<void> {
    await this.page.goto("/sign-in");
  }

  /** Fill the email address field. */
  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  /** Fill the password field. */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Click the "Sign in" submit button.
   * Expects a mocked route handler to be registered for POST /auth/sign-in
   * before this is called, otherwise a real network request will fire.
   */
  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Convenience method: fill both credential fields then submit the form.
   * This is the primary entry-point used by the test spec — it represents
   * the complete "sign in" user action as a single logical step.
   */
  async submitCredentials(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }

  // ── Assertions ─────────────────────────────────────────────────────────────

  /**
   * Assert the sign-in page is fully rendered and all interactive elements
   * are visible. Uses web-first assertions (auto-retrying, no timeouts).
   */
  async assertIsLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/sign-in/);
    await expect(this.heading).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }
}
