import { publicPageMetadata } from "@/lib/public-metadata";
import GuildsClient from "./GuildsClient";

export const metadata = publicPageMetadata({
  title: "Guilds",
  description:
    "Discover communities on pilput — join a guild to follow the people and topics you care about.",
  canonicalPath: "/guilds",
  keywords: ["guilds", "communities", "groups", "pilput"],
  openGraphTitle: "Guilds | pilput",
});

export default function GuildsPage() {
  return <GuildsClient />;
}
