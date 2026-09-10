import { format, subDays } from "date-fns";

export function defaultStartDate(): string {
  return format(subDays(new Date(), 30), "yyyy-MM-dd");
}

export function defaultEndDate(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function displayName(person: {
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}): string {
  const full = [person.firstName, person.lastName].filter(Boolean).join(" ").trim();
  if (full) return full;
  if (person.username) return person.username;
  return "Unknown user";
}
