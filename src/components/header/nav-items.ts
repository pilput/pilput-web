export type NavItem = { name: string; href: string };

export function getMainNavItems(isLoggedIn: boolean): NavItem[] {
  return [
    {
      name: isLoggedIn ? "For you" : "Home",
      href: "/",
    },
    { name: isLoggedIn ? "Latest" : "Blog", href: "/blog" },
    ...(!isLoggedIn ? [{ name: "About", href: "/about" }] : []),
    { name: "Chat", href: "/chat" },
  ];
}
