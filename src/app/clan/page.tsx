import theme from "@/app/theme";
import {
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconBrandDiscord,
  IconCalendarEvent,
  IconCamera,
  IconGrid4x4,
  IconHome,
  IconUserPlus,
  IconUsers,
} from "@tabler/icons-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Melon Clan",
  description:
    "Join the Melon clan - a social OSRS clan with no requirements. Find us on World 495, participate in bingo events, and share your drops with Dink integration.",
};

const features = [
  {
    icon: IconGrid4x4,
    title: "Clan Bingos",
    description:
      "Team-based bingo competitions with prizes and bragging rights.",
    color: theme.colors.brand[5],
  },
  {
    icon: IconCalendarEvent,
    title: "Events",
    description: "Group activities and competitions coming in the future.",
    color: theme.colors.warning[4],
  },
  {
    icon: IconCamera,
    title: "Dink Integration",
    description:
      "Share your drops, achievements, and progress automatically in Discord.",
    color: theme.colors.success[5],
  },
];

export default function ClanPage() {
  return (
    <Stack align="center" my="xl" maw={800} w="100%" mx="auto" gap="xl">
      <Stack align="center" gap="xs">
        <Group gap="sm" align="center">
          <IconUsers size={36} color={theme.colors.brand[5]} />
          <Title
            order={1}
            className="gradient-text"
            style={{
              backgroundImage: `linear-gradient(135deg, ${theme.colors.brand[3]} 0%, ${theme.colors.brand[7]} 100%)`,
            }}
          >
            Melon Clan
          </Title>
        </Group>
        <Text c="dimmed" ta="center" maw={500}>
          A social clan for everyone. No requirements, just good vibes.
        </Text>
      </Stack>

      <Card withBorder radius="md" p="xl" w="100%">
        <Stack gap="lg">
          <Group gap="md" align="flex-start">
            <ThemeIcon size={48} radius="md" variant="light" color="brand">
              <IconHome size={28} />
            </ThemeIcon>
            <Stack gap={4} style={{ flex: 1 }}>
              <Text fw={600} size="lg">
                Home World 495
              </Text>
              <Text size="sm" c="dimmed">
                Find us hanging out on World 495. Stop by and say hi!
              </Text>
            </Stack>
          </Group>

          <Group gap="md" align="flex-start">
            <ThemeIcon size={48} radius="md" variant="light" color="green">
              <IconUserPlus size={28} />
            </ThemeIcon>
            <Stack gap={4} style={{ flex: 1 }}>
              <Text fw={600} size="lg">
                How to Join
              </Text>
              <Text size="sm" c="dimmed">
                Anyone is welcome! Simply join as a guest in the clan chat and
                ask for an invite. There are no requirements - we&apos;re a
                social clan open to all players.
              </Text>
            </Stack>
          </Group>
        </Stack>
      </Card>

      <Stack w="100%" gap="md">
        <Title order={2} ta="center">
          Clan Features
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
          {features.map((feature) => (
            <Card key={feature.title} withBorder radius="md" p="lg">
              <Stack gap="sm" align="center" ta="center">
                <ThemeIcon size={40} radius="md" variant="light" color="gray">
                  <feature.icon size={24} color={feature.color} />
                </ThemeIcon>
                <Text fw={600}>{feature.title}</Text>
                <Text size="sm" c="dimmed">
                  {feature.description}
                </Text>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>

      <Card withBorder radius="md" p="lg" bg="dark.8" w="100%">
        <Stack align="center" gap="md">
          <IconBrandDiscord size={32} color="#5865F2" />
          <Title order={3} ta="center">
            Join the Community
          </Title>
          <Text ta="center" c="dimmed" maw={400}>
            Connect with clan members, get notifications for events, and share
            your progress.
          </Text>
          <Link
            href="https://discord.com/invite/BrJfA6q"
            target="_blank"
            style={{
              color: "#5865F2",
              fontWeight: 600,
              textDecoration: "underline",
            }}
          >
            Join Discord
          </Link>
        </Stack>
      </Card>
    </Stack>
  );
}
