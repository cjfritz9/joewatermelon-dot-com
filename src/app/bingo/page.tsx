import theme from "@/app/theme";
import {
  Alert,
  Badge,
  Card,
  Grid,
  GridCol,
  Group,
  List,
  ListItem,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconBrandDiscord,
  IconCheck,
  IconCrown,
  IconEye,
  IconGrid4x4,
  IconLock,
  IconSparkles,
  IconTargetArrow,
  IconTrophy,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import Link from "next/link";

const previewTiles = [
  { text: "Boss Pet", completed: true },
  { text: "Ancient Hilt", completed: true },
  { text: "Nightmare Unique", completed: false },
  { text: "Godwars Unique", completed: false },
  { text: "Scythe, Shadow or Tbow", highlighted: true },
  { text: "Boss Jar", completed: true },
  { text: "Any Tome", completed: false },
  { text: "Barrows Unique", completed: false },
  { text: "Doom Unique", completed: false },
];

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const features: FeatureCard[] = [
  {
    icon: <IconUsersGroup size={24} />,
    title: "Team-Based Competition",
    description: "Players are divided into teams with designated captains. Work together to complete tiles and climb the leaderboard.",
    color: theme.colors.brand[6],
  },
  {
    icon: <IconGrid4x4 size={24} />,
    title: "Interactive Bingo Boards",
    description: "Each team gets their own board. Tiles can be highlighted for focus, marked in progress, or crossed out when complete.",
    color: theme.colors.warning[4],
  },
  {
    icon: <IconCrown size={24} />,
    title: "Captain Controls",
    description: "Team captains can manage their board, assign tiles to members, and coordinate strategy for maximum points.",
    color: theme.colors.error[5],
  },
  {
    icon: <IconEye size={24} />,
    title: "Live Progress Tracking",
    description: "Watch your team's progress in real-time. Admins can view all boards while teams focus on their own competition.",
    color: theme.colors.success[6],
  },
];

export default function BingoPage() {
  return (
    <Stack align="center" my="xl" maw={1040} w="100%" mx="auto" gap="xl">
      <Stack align="center" gap="xs">
        <Group gap="sm" align="center">
          <IconGrid4x4 size={36} color={theme.colors.brand[5]} />
          <Title
            order={1}
            className="gradient-text"
            style={{
              backgroundImage: `linear-gradient(135deg, ${theme.colors.brand[4]} 0%, ${theme.colors.brand[7]} 100%)`,
            }}
          >
            Clan Bingos
          </Title>
        </Group>
        <Badge size="lg" color="yellow" variant="light" leftSection={<IconSparkles size={14} />}>
          Coming Soon
        </Badge>
        <Text c="dimmed" ta="center" maw={600} mt="xs">
          Compete in clan-wide bingo events with your team. Complete tiles, track progress,
          and climb the leaderboard together.
        </Text>
      </Stack>

      <Alert
        icon={<IconBrandDiscord size={20} />}
        color="indigo"
        title="Get Notified"
        radius="md"
        w="100%"
      >
        <Text size="sm">
          Join the Discord to be notified when the next bingo event starts and to find a team!
        </Text>
        <Link
          href="https://discord.com/invite/BrJfA6q"
          target="_blank"
          style={{ color: "#5865F2", fontWeight: 600 }}
        >
          Join Discord
        </Link>
      </Alert>

      <Grid gutter="xl" w="100%">
        <GridCol span={{ base: 12, md: 5 }}>
          <Stack gap="md">
            <Group gap="xs">
              <IconTargetArrow size={20} color={theme.colors.warning[4]} />
              <Text fw={600}>Board Preview</Text>
            </Group>
            <Card withBorder radius="md" p="md" bg="dark.8">
              <SimpleGrid cols={3} spacing="xs">
                {previewTiles.map((tile, i) => (
                  <Card
                    key={i}
                    withBorder
                    radius="sm"
                    p="xs"
                    bg={tile.completed ? "green.9" : tile.highlighted ? "yellow.9" : "dark.6"}
                    style={{
                      aspectRatio: "1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: tile.completed ? 0.8 : 1,
                      borderColor: tile.highlighted ? theme.colors.warning[5] : undefined,
                      borderWidth: tile.highlighted ? 2 : 1,
                    }}
                  >
                    <Stack gap={2} align="center">
                      {tile.completed && (
                        <IconCheck size={16} color="white" />
                      )}
                      <Text
                        size="xs"
                        ta="center"
                        fw={500}
                        style={{
                          textDecoration: tile.completed ? "line-through" : "none",
                        }}
                      >
                        {tile.text}
                      </Text>
                    </Stack>
                  </Card>
                ))}
              </SimpleGrid>
              <Text size="xs" c="dimmed" ta="center" mt="sm">
                Example bingo board with completed and highlighted tiles
              </Text>
            </Card>
          </Stack>
        </GridCol>

        <GridCol span={{ base: 12, md: 7 }}>
          <Stack gap="md">
            <Group gap="xs">
              <IconTrophy size={20} color={theme.colors.success[5]} />
              <Text fw={600}>How It Works</Text>
            </Group>
            <List spacing="md" size="sm" c="dimmed">
              <ListItem
                icon={
                  <ThemeIcon size={24} radius="xl" color="brand.7">
                    <Text size="xs" fw={700}>1</Text>
                  </ThemeIcon>
                }
              >
                <Text fw={500} c="white">Teams are formed</Text>
                <Text size="sm">Players sign up and are assigned to teams with a captain who coordinates strategy.</Text>
              </ListItem>
              <ListItem
                icon={
                  <ThemeIcon size={24} radius="xl" color="brand.7">
                    <Text size="xs" fw={700}>2</Text>
                  </ThemeIcon>
                }
              >
                <Text fw={500} c="white">Bingo boards are revealed</Text>
                <Text size="sm">Each team gets the same board with various OSRS challenges to complete.</Text>
              </ListItem>
              <ListItem
                icon={
                  <ThemeIcon size={24} radius="xl" color="brand.7">
                    <Text size="xs" fw={700}>3</Text>
                  </ThemeIcon>
                }
              >
                <Text fw={500} c="white">Complete tiles together</Text>
                <Text size="sm">Work as a team to complete tiles. Captains can highlight focus tiles and track progress.</Text>
              </ListItem>
              <ListItem
                icon={
                  <ThemeIcon size={24} radius="xl" color="brand.7">
                    <Text size="xs" fw={700}>4</Text>
                  </ThemeIcon>
                }
              >
                <Text fw={500} c="white">Compete for the win</Text>
                <Text size="sm">Score points for completed tiles, lines, and full boards. Top teams win prizes!</Text>
              </ListItem>
            </List>
          </Stack>
        </GridCol>
      </Grid>

      <Stack w="100%" gap="md">
        <Title order={2} ta="center">
          Features
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          {features.map((feature) => (
            <Card key={feature.title} withBorder radius="md" p="lg">
              <Group gap="md" align="flex-start">
                <ThemeIcon size={40} radius="md" variant="light" color="gray">
                  <div style={{ color: feature.color }}>{feature.icon}</div>
                </ThemeIcon>
                <Stack gap={4} style={{ flex: 1 }}>
                  <Text fw={600}>{feature.title}</Text>
                  <Text size="sm" c="dimmed">{feature.description}</Text>
                </Stack>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>

      <Card withBorder radius="md" p="lg" w="100%">
        <Group gap="md" align="flex-start">
          <ThemeIcon size={40} radius="md" variant="light" color="gray">
            <IconLock size={24} color={theme.colors.brand[5]} />
          </ThemeIcon>
          <Stack gap="xs" style={{ flex: 1 }}>
            <Text fw={600}>Privacy & Permissions</Text>
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              <Stack gap={4}>
                <Group gap="xs">
                  <IconUsers size={16} color={theme.colors.brand[5]} />
                  <Text size="sm" fw={500}>Team Members</Text>
                </Group>
                <Text size="xs" c="dimmed">View and interact with your team&apos;s board only</Text>
              </Stack>
              <Stack gap={4}>
                <Group gap="xs">
                  <IconCrown size={16} color={theme.colors.warning[4]} />
                  <Text size="sm" fw={500}>Captains</Text>
                </Group>
                <Text size="xs" c="dimmed">Manage your team&apos;s board, highlight tiles, mark progress</Text>
              </Stack>
              <Stack gap={4}>
                <Group gap="xs">
                  <IconEye size={16} color={theme.colors.error[5]} />
                  <Text size="sm" fw={500}>Admins</Text>
                </Group>
                <Text size="xs" c="dimmed">View all team boards and manage the event</Text>
              </Stack>
            </SimpleGrid>
          </Stack>
        </Group>
      </Card>

      <Card withBorder radius="md" p="lg" bg="dark.8" w="100%">
        <Stack align="center" gap="md">
          <IconBrandDiscord size={32} color="#5865F2" />
          <Title order={3} ta="center">
            Ready to Compete?
          </Title>
          <Text ta="center" c="dimmed" maw={500}>
            Bingo events are announced in the Discord. Join to find a team,
            get event notifications, and be part of the next competition!
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
