export type NavItem = { name: string; href: string };

export function getMainNavItems(isLoggedIn: boolean): NavItem[] {
  return [
    {
      name: isLoggedIn ? "Feed" : "Home",
      href: "/",
    },
    { name: "Blog", href: "/blog" },
    ...(!isLoggedIn ? [{ name: "About", href: "/about" }] : []),
    { name: "Chat", href: "/chat" },
  ];
}
