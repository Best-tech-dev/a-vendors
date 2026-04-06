import { test, expect } from "@playwright/test";

test("should navigate to the home page and check the title", async ({
  page,
}) => {
  // Go to the baseURL defined in config
  await page.goto("/");

  // Check that the heading contains specific text
  const heading = page.locator("h1");
  await expect(heading).toContainText(
    "To get started, edit the page.tsx file.",
  );
});
