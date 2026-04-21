import { expect, test } from "@playwright/test";

test("empty state can be reset back to the full list", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: /open filters/i }).click();
  await page.getByLabel("Max Price").fill("0");

  await expect(page.getByText("이 조건에 맞는 할인이 없어요")).toBeVisible();
  await page.getByRole("button", { name: /reset filters/i }).click();

  await expect(page.getByText("빅맥 세트 할인")).toBeVisible();
});

