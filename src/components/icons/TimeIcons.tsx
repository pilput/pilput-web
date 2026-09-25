import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function BaseIcon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

/** Minimal calendar: rounded body, binder rings and a filled "today" marker. */
export function CalendarIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="3.75" y="5" width="16.5" height="15.25" rx="4.25" />
      <path d="M8 3.25v3.5M16 3.25v3.5M3.75 10h16.5" />
      <rect x="7.5" y="13" width="3.5" height="3.5" rx="1" fill="currentColor" stroke="none" />
    </BaseIcon>
  );
}

/** Minimal clock: open dial with short hands. */
export function ClockIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="8.75" />
      <path d="M12 7.75V12l2.75 1.75" />
    </BaseIcon>
  );
}

/** Calendar with a small clock badge, for scheduled/upcoming events. */
export function CalendarClockIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M20.25 11V9.25A4.25 4.25 0 0 0 16 5H8a4.25 4.25 0 0 0-4.25 4.25V16A4.25 4.25 0 0 0 8 20.25h3" />
      <path d="M8 3.25v3.5M16 3.25v3.5M3.75 10h7" />
      <circle cx="17" cy="17" r="4.25" />
      <path d="M17 15.25V17l1.25.75" />
    </BaseIcon>
  );
}
