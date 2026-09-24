import GuildsLayoutClient from "./GuildsLayoutClient";

export default function GuildsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GuildsLayoutClient>{children}</GuildsLayoutClient>;
}
