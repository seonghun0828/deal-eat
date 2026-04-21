import { isNew } from "@/lib/isNew";

describe("isNew", () => {
  const now = new Date("2026-04-21T12:00:00+09:00");

  it("returns true when the launch date is exactly 14 days ago", () => {
    expect(isNew("2026-04-08", now)).toBe(true);
  });

  it("returns false when the launch date is 15 days ago", () => {
    expect(isNew("2026-04-07", now)).toBe(false);
  });

  it("returns false when launch date is missing", () => {
    expect(isNew(undefined, now)).toBe(false);
  });
});

