import theme from "@/app/theme";
import { Badge, Card, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { IconClock, IconDroplet, IconPyramid } from "@tabler/icons-react";
import Link from "next/link";

interface QueueLink {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
  disabled?: boolean;
}

const queues: QueueLink[] = [
  {
    title: "ToA Speed",
    description: "Tombs of Amascut GM Time runs. Get your combat achievement!",
    icon: <IconPyramid size={32} color={theme.colors.warning[4]} />,
    href: "/queues/toa-speed",
  },
  {
    title: "ToB Speed",
    description: "Theatre of Blood speed runs.",
    icon: <IconDroplet size={32} color="#DC143C" />,
    href: "/queues/tob-speed",
  },
];

export default function QueuesPage() {
  return (
    <Stack align="center" my="xl" maw={1040} w="100%" mx="auto">
      <Title c={theme.colors.warning[3]} mb="md">
        Queues
      </Title>

      <Text c="dimmed" ta="center" maw={600}>
        Join a queue for group content. Sign up, wait for your turn, and get notified when it&apos;s time to join.
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" mt="xl" w="100%" maw={800}>
        {queues.map((queue) => {
          const content = (
            <Card
              shadow="md"
              radius="md"
              p="lg"
              withBorder
              style={{
                height: "100%",
                opacity: queue.disabled ? 0.6 : 1,
                cursor: queue.disabled ? "not-allowed" : "pointer",
              }}
            >
              <Group gap="md" align="flex-start">
                {queue.icon}
                <Stack gap="xs" style={{ flex: 1 }}>
                  <Group justify="space-between" align="center">
                    <Text fw={600} size="lg">{queue.title}</Text>
                    {queue.badge && (
                      <Badge color="gray" variant="light" leftSection={<IconClock size={12} />}>
                        {queue.badge}
                      </Badge>
                    )}
                  </Group>
                  <Text size="sm" c="dimmed">
                    {queue.description}
                  </Text>
                </Stack>
              </Group>
            </Card>
          );

          if (queue.disabled) {
            return <div key={queue.title}>{content}</div>;
          }

          return (
            <Link key={queue.title} href={queue.href} style={{ textDecoration: "none" }}>
              {content}
            </Link>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}
