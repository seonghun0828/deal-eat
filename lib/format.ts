const priceFormatter = new Intl.NumberFormat("ko-KR");

const shortDateFormatter = new Intl.DateTimeFormat("ko-KR", {
  month: "numeric",
  day: "numeric",
});

const timestampFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export const formatPrice = (value: number): string =>
  `₩${priceFormatter.format(value)}`;

export const formatShortDate = (value: string): string => {
  const parsed = new Date(`${value}T00:00:00+09:00`);
  return shortDateFormatter.format(parsed);
};

export const formatUpdatedAt = (value: string): string =>
  timestampFormatter.format(new Date(value));

