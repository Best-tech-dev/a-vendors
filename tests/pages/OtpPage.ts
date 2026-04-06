import { type Page, type Locator, expect } from "@playwright/test";

/**
 * Page Object Model for the /verify (OTP) route.
 *
 * Encapsulates all locators and user-facing actions for the OTP verification
 * form, isolating the spec from raw DOM selectors.
 *
 * SELECTOR STRATEGY
 * -----------------
 * Like the sign-in page, FormLabel here is rendered outside a FormItem context
 * for the email display field, so no `htmlFor`/`id` association is generated.
 *
 *  - `getByPlaceholder('Enter OTP')` — the OTP Input's placeholder, unique
 *    on this page and defined directly in the JSX.
 *  - `input[readonly]` attribute selector — the InputGroupInput component
 *    receives the `readOnly` prop which flows through to the underlying
 *    <input readonly>. There is exactly one readonly input on this page,
 *    making this selector unambiguous.
 *  - `getByRole('button', { name: 'Verify' })` — semantic role + text.
 *  - `getByRole('heading', { name: 'Verify Your Identity' })` — H1 landmark.
 */
export class OtpPage {
  readonly page: Page;

  // ── Locators ──────────────────────────────────────────────────────────────

  /**
   * OTP text input.
   * Defined in verify/page.tsx: <Input placeholder="Enter OTP" {...field} />
   */
  readonly otpInput: Locator;

  /**
   * Read-only email display input (rendered by InputGroupInput with `readOnly`).
   *
   * The InputGroupInput component renders as an Input (which renders as
   * <input data-slot="input-group-control" readonly ...>). The `readOnly`
   * prop creates the HTML `readonly` attribute. There is only one readonly
   * input on this page, so this attribute selector is stable.
   *
   * Used to assert that the correct pending email from the previous step
   * is shown to the user.
   */
  readonly emailDisplay: Locator;

  /** Verify / submit button. */
  readonly submitButton: Locator;

  /** H1 heading — a reliable page-loaded assertion landmark. */
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.otpInput = page.getByPlaceholder("Enter OTP");
    this.emailDisplay = page.locator("input[readonly]");
    this.submitButton = page.getByRole("button", { name: "Verify" });
    this.heading = page.getByRole("heading", { name: "Verify Your Identity" });
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /**
   * Type the OTP code into the input field.
   * `fill()` clears the field first, then types the value — safe for re-use.
   */
  async enterCode(otp: string): Promise<void> {
    await this.otpInput.fill(otp);
  }

  /**
   * Click the Verify submit button.
   * Expects a mocked route handler to be registered for
   * POST /auth/admin-verify-login-otp before this is called.
   */
  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Convenience method: enter the OTP code and immediately submit.
   * This is the primary action used by the test spec — it represents the
   * complete "verify OTP" user action as a single logical step.
   */
  async enterAndSubmit(otp: string): Promise<void> {
    await this.enterCode(otp);
    await this.submit();
  }

  // ── Assertions ─────────────────────────────────────────────────────────────

  /**
   * Assert the OTP page is fully rendered and interactive.
   * Uses web-first assertions — auto-retrying, no arbitrary waits.
   */
  async assertIsLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/verify/);
    await expect(this.heading).toBeVisible();
    await expect(this.otpInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  /**
   * Assert the read-only email field displays the expected pending email.
   *
   * This confirms that the Zustand `pendingEmail` state set during sign-in
   * was correctly read by the verify page and rendered in the InputGroupInput.
   */
  async assertPendingEmailDisplayed(email: string): Promise<void> {
    await expect(this.emailDisplay).toHaveValue(email);
  }
}
