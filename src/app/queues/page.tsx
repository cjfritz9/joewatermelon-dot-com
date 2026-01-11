import theme from "@/app/theme";
import { getToa8SpeedSettings } from "@/lib/server/toa-queues";
import { getTobSpeedSettings } from "@/lib/server/tob-queues";
import { Badge, Card, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { IconDroplet, IconPlayerPlay, IconPlayerStop, IconPyramid } from "@tabler/icons-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Queues",
  description:
    "Join queues for ToA and ToB Grandmaster speed runs. Sign up, wait your turn, and get notified when it's time to raid with JoeWatermelon.",
};

export const dynamic = "force-dynamic";

export default async function QueuesPage() {
  const [toaSettings, tobSettings] = await Promise.all([
    getToa8SpeedSettings(),
    getTobSpeedSettings(),
  ]);

  const queues = [
    {
      title: "ToA Speed",
      description: "Tombs of Amascut 8 man GM Time runs",
      icon: <IconPyramid size={32} color={theme.colors.warning[4]} />,
      href: "/queues/toa-speed",
      status: toaSettings.status,
    },
    {
      title: "ToB Speed",
      description: "Theatre of Blood 4 & 5 man GM Time runs",
      icon: <IconDroplet size={32} color="#DC143C" />,
      href: "/queues/tob-speed",
      status: tobSettings.status,
    },
  ];
  return (
    <Stack align="center" my="xl" maw={1040} w="100%" mx="auto">
      <Title c={theme.colors.warning[3]} mb="md">
        Queues
      </Title>

      <Text c="dimmed" ta="center" maw={600}>
        Join a queue for group content. Sign up, wait for your turn, and get notified when it&apos;s time to join.
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" mt="xl" w="100%" maw={800}>
        {queues.map((queue) => (
          <Link key={queue.title} href={queue.href} style={{ textDecoration: "none" }}>
            <Card
              shadow="md"
              radius="md"
              p="lg"
              withBorder
              className="hover-card"
              style={{ height: "100%" }}
            >
              <Group gap="md" align="flex-start">
                {queue.icon}
                <Stack gap="xs" style={{ flex: 1 }}>
                  <Group justify="space-between" align="center">
                    <Text fw={600} size="lg">{queue.title}</Text>
                    <Badge
                      color={queue.status === "active" ? "green" : "gray"}
                      variant="light"
                      leftSection={queue.status === "active" ? <IconPlayerPlay size={12} /> : <IconPlayerStop size={12} />}
                    >
                      {queue.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </Group>
                  <Text size="sm" c="dimmed">
                    {queue.description}
                  </Text>
                </Stack>
              </Group>
            </Card>
          </Link>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
