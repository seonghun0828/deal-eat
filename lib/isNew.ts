const SEOUL_TIMEZONE = "Asia/Seoul";
const DAY_WINDOW = 14;

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: SEOUL_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const todayKST = (daysOffset = 0, now = new Date()): string => {
  const utcBased = new Date(now.getTime() + daysOffset * 24 * 60 * 60 * 1000);
  return dateFormatter.format(utcBased);
};

export const isNew = (launchDate?: string, now = new Date()): boolean => {
  if (!launchDate) {
    return false;
  }

  const cutoff = todayKST(-(DAY_WINDOW - 1), now);
  return launchDate >= cutoff;
};

