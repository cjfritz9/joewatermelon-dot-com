import theme from "@/app/theme";
import {
  Alert,
  Badge,
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
  IconBrandYoutube,
  IconClock,
  IconDroplet,
  IconExternalLink,
  IconPyramid,
  IconStar,
  IconTrophy,
  IconUsers,
} from "@tabler/icons-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Combat Achievements",
  description:
    "Free Grandmaster Combat Achievement help for OSRS raids. Join ToA and ToB speed run queues and get your GM times with experienced runners.",
};

interface QueueCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  times: string[];
}

const speedRunQueues: QueueCard[] = [
  {
    title: "ToA Speed Queue",
    description: "Tombs of Amascut 8-man Grandmaster Time runs. Join the queue and get your GM time with experienced runners.",
    icon: <IconPyramid size={32} />,
    href: "/queues/toa-speed",
    color: theme.colors.warning[4],
    times: ["8-Man GM Time"],
  },
  {
    title: "ToB Speed Queue",
    description: "Theatre of Blood 4 & 5 man Grandmaster Time runs. Sign up for the team size you need.",
    icon: <IconDroplet size={32} />,
    href: "/queues/tob-speed",
    color: "#DC143C",
    times: ["4-Man GM Time", "5-Man GM Time"],
  },
];

interface GuideSection {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  guides: Guide[];
}

interface Guide {
  title: string;
  description?: string;
  youtubeUrl?: string;
  infoUrl?: string;
}

const guideSections: GuideSection[] = [
  {
    title: "Raid Speed Times",
    description: "Guides and tips for getting Grandmaster speed times in raids.",
    icon: <IconClock size={24} />,
    color: theme.colors.brand[6],
    guides: [
      {
        title: "ToA 8-Man Speed Guide",
        description: "Full breakdown of the 8-man ToA speed strategy.",
        infoUrl: "/queues/toa-speed/info",
      },
      {
        title: "ToB 4 & 5 Man Speed Guide",
        description: "Strategies for Theatre of Blood GM times.",
        infoUrl: "/queues/tob-speed/info",
      },
    ],
  },
  {
    title: "Boss Combat Achievements",
    description: "Tips and strategies for various boss combat achievements.",
    icon: <IconTrophy size={24} />,
    color: theme.colors.success[6],
    guides: [
      {
        title: "More guides coming soon!",
        description: "Check back later or join the Discord for the latest updates.",
      },
    ],
  },
];

export default function CombatAchievementsPage() {
  return (
    <Stack align="center" my="xl" maw={1040} w="100%" mx="auto" gap="xl">
      <Stack align="center" gap="xs">
        <Group gap="sm" align="center">
          <IconTrophy size={36} color={theme.colors.warning[4]} />
          <Title
            order={1}
            className="gradient-text"
            style={{
              backgroundImage: `linear-gradient(135deg, ${theme.colors.warning[3]} 0%, ${theme.colors.warning[5]} 100%)`,
            }}
          >
            Combat Achievements
          </Title>
        </Group>
        <Text c="dimmed" ta="center" maw={600}>
          Get help with your Combat Achievement grind. Join speed run queues for Grandmaster times
          or check out guides for various bosses and challenges.
        </Text>
      </Stack>

      <Alert
        icon={<IconUsers size={20} />}
        color="green"
        title="Free GM Speed Run Help"
        radius="md"
        w="100%"
      >
        <Text size="sm">
          Joe runs free Grandmaster speed time carries for ToA and ToB on stream.
          Join a queue below and get notified when it&apos;s your turn!
        </Text>
      </Alert>

      <Stack w="100%" gap="md">
        <Group gap="xs" align="center">
          <IconStar size={24} color={theme.colors.warning[4]} />
          <Title order={2}>Speed Run Queues</Title>
        </Group>
        <Text size="sm" c="dimmed">
          Sign up for a queue to join stream speed runs. You&apos;ll be notified when it&apos;s your turn.
        </Text>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          {speedRunQueues.map((queue) => (
            <Link key={queue.title} href={queue.href} style={{ textDecoration: "none" }}>
              <Card
                shadow="md"
                radius="md"
                p="lg"
                withBorder
                style={{ height: "100%", cursor: "pointer" }}
                className="hover-card"
              >
                <Stack gap="md">
                  <Group gap="md" align="flex-start">
                    <ThemeIcon size={48} radius="md" variant="light" color="gray">
                      <div style={{ color: queue.color }}>{queue.icon}</div>
                    </ThemeIcon>
                    <Stack gap={4} style={{ flex: 1 }}>
                      <Text fw={600} size="lg">{queue.title}</Text>
                      <Group gap="xs">
                        {queue.times.map((time) => (
                          <Badge key={time} color="green" variant="light" size="sm">
                            {time}
                          </Badge>
                        ))}
                      </Group>
                    </Stack>
                  </Group>
                  <Text size="sm" c="dimmed">
                    {queue.description}
                  </Text>
                  <Group gap="xs" c={queue.color}>
                    <Text size="sm" fw={500}>Join Queue</Text>
                    <IconExternalLink size={14} />
                  </Group>
                </Stack>
              </Card>
            </Link>
          ))}
        </SimpleGrid>
      </Stack>

      <Stack w="100%" gap="lg">
        <Group gap="xs" align="center">
          <IconBrandYoutube size={24} color="#FF0000" />
          <Title order={2}>Guides & Resources</Title>
        </Group>

        {guideSections.map((section) => (
          <Card key={section.title} withBorder radius="md" p="lg">
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon size={32} radius="md" variant="light" color="gray">
                  <div style={{ color: section.color }}>{section.icon}</div>
                </ThemeIcon>
                <div>
                  <Text fw={600}>{section.title}</Text>
                  <Text size="xs" c="dimmed">{section.description}</Text>
                </div>
              </Group>

              <Stack gap="sm">
                {section.guides.map((guide) => (
                  <Card key={guide.title} withBorder radius="sm" p="md" bg="dark.7">
                    <Group justify="space-between" align="flex-start">
                      <Stack gap={4} style={{ flex: 1 }}>
                        <Text fw={500}>{guide.title}</Text>
                        {guide.description && (
                          <Text size="sm" c="dimmed">{guide.description}</Text>
                        )}
                      </Stack>
                      <Group gap="xs">
                        {guide.youtubeUrl && (
                          <Link href={guide.youtubeUrl} target="_blank">
                            <ThemeIcon size={28} radius="md" color="red" variant="light">
                              <IconBrandYoutube size={16} />
                            </ThemeIcon>
                          </Link>
                        )}
                        {guide.infoUrl && (
                          <Link href={guide.infoUrl}>
                            <ThemeIcon size={28} radius="md" color="blue" variant="light">
                              <IconExternalLink size={16} />
                            </ThemeIcon>
                          </Link>
                        )}
                      </Group>
                    </Group>
                  </Card>
                ))}
              </Stack>
            </Stack>
          </Card>
        ))}
      </Stack>

      <Card withBorder radius="md" p="lg" bg="dark.8" w="100%">
        <Stack align="center" gap="md">
          <IconBrandDiscord size={32} color="#5865F2" />
          <Title order={3} ta="center">
            Need More Help?
          </Title>
          <Text ta="center" c="dimmed" maw={500}>
            Join the Discord community for live help, announcements about upcoming speed runs,
            and to connect with other players working on Combat Achievements.
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
