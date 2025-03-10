type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export function getKorDate() {
  const now = new Date();
  const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  return new Date(utc.getTime() + 9 * 60 * 60 * 1000);
}

export function getDayOfWeek(date: Date): DayOfWeek {
  return date
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase() as DayOfWeek;
}

export function getYYYYMMDD(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `"${year}-${month}-${day}"`;
}
