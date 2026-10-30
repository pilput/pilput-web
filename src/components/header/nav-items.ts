export type NavItem = { name: string; href: string };

export function getMainNavItems(isLoggedIn: boolean): NavItem[] {
  return [
    {
      name: isLoggedIn ? "For you" : "Home",
      href: "/",
    },
    { name: isLoggedIn ? "Latest" : "Blog", href: "/blog" },
    ...(!isLoggedIn ? [{ name: "About", href: "/about" }] : []),
    { name: "Guilds", href: "/guilds" },
    { name: "Chat", href: "/chat" },
  ];
}

/** "/" only matches itself; other items also match their sub-pages (e.g. /blog/…). */
export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
