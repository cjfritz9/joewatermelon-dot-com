import TwitchLiveSection from "@/components/home/TwitchLiveSection";
import YouTubeSection from "@/components/home/YouTubeSection";
import { isAdmin } from "@/lib/session";
import { checkIfLive, getLatestVod } from "@/lib/twitch";
import { getFeaturedOrLatestVideo, getFeaturedVideoSettings } from "@/lib/youtube";
import {
  Badge,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconSword,
  IconTrophy,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import Link from "next/link";
import theme from "./theme";

export const revalidate = 60;

interface QuickLinkCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  badge?: string;
  disabled?: boolean;
}

const quickLinks: QuickLinkCard[] = [
  {
    title: "Queues",
    description: "Join queues for group content like ToA and ToB speed runs.",
    icon: <IconUsersGroup size={28} />,
    href: "/queues",
    color: theme.colors.brand[7],
  },
  {
    title: "CA Guides",
    description: "Combat Achievement guides and tips.",
    icon: <IconTrophy size={28} />,
    href: "/guides",
    color: theme.colors.brand[8],
    badge: "Coming Soon",
    disabled: true,
  },
  {
    title: "Melon Clan",
    description: "Join the Melon clan community.",
    icon: <IconUsers size={28} />,
    href: "/clan",
    color: theme.colors.brand[3],
    badge: "Coming Soon",
    disabled: true,
  },
  {
    title: "Clan Bingos",
    description: "Participate in clan bingo events and competitions.",
    icon: <IconSword size={28} />,
    href: "/bingo",
    color: theme.colors.brand[4],
    badge: "Coming Soon",
    disabled: true,
  },
];

export default async function Home() {
  const [liveStatus, video, featuredSettings, isUserAdmin] = await Promise.all([
    checkIfLive("JoeWatermelon"),
    getFeaturedOrLatestVideo(),
    getFeaturedVideoSettings(),
    isAdmin(),
  ]);

  const latestVod = !liveStatus.isLive ? await getLatestVod("JoeWatermelon") : null;

  const isFeatured = !!featuredSettings.featuredVideoId;

  return (
    <Stack align="center" my="xl" maw={1040} w="100%" mx="auto" gap="xl">
      <Stack align="center" gap="xs">
        <Title
          order={1}
          ta="center"
          className="gradient-text"
          style={{
            backgroundImage: `linear-gradient(135deg, ${theme.colors.brand[3]} 0%, ${theme.colors.brand[4]} 40%, ${theme.colors.brand[7]} 100%)`,
          }}
        >
          JoeWatermelon
        </Title>
        <Text c="dimmed" ta="center" maw={500}>
          OSRS content creator, speedrunner, and community builder. Join the Melon clan today!
        </Text>
      </Stack>

      {liveStatus.isLive && <TwitchLiveSection liveStatus={liveStatus} />}

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" w="100%">
        {!liveStatus.isLive && <TwitchLiveSection liveStatus={liveStatus} latestVod={latestVod} />}

        <YouTubeSection
          video={video}
          isFeatured={isFeatured}
          isAdmin={isUserAdmin}
          currentFeaturedId={featuredSettings.featuredVideoId}
        />
      </SimpleGrid>

      <Stack w="100%" gap="md">
        <Title
          order={2}
          ta="center"
          className="gradient-text"
          style={{
            backgroundImage: `linear-gradient(135deg, ${theme.colors.brand[3]} 0%, ${theme.colors.brand[7]} 100%)`,
          }}
        >
          Explore
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
          {quickLinks.map((link) => {
            const content = (
              <Card
                key={link.title}
                withBorder
                radius="md"
                p="lg"
                style={{
                  height: "100%",
                  opacity: link.disabled ? 0.6 : 1,
                  cursor: link.disabled ? "not-allowed" : "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                className={link.disabled ? "" : "hover-card"}
              >
                <Stack gap="sm" align="center" ta="center">
                  <div style={{ color: link.color }}>{link.icon}</div>
                  <Group gap="xs" justify="center">
                    <Text fw={600}>{link.title}</Text>
                    {link.badge && (
                      <Badge size="xs" color="gray" variant="light">
                        {link.badge}
                      </Badge>
                    )}
                  </Group>
                  <Text size="sm" c="dimmed">
                    {link.description}
                  </Text>
                </Stack>
              </Card>
            );

            if (link.disabled) {
              return <div key={link.title}>{content}</div>;
            }

            return (
              <Link
                key={link.title}
                href={link.href}
                style={{ textDecoration: "none" }}
              >
                {content}
              </Link>
            );
          })}
        </SimpleGrid>
      </Stack>
    </Stack>
  );
}
