"use client";

import PrepareForRun from "@/components/queues/PrepareForTheRun";
import {
  Alert,
  Badge,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconCheck,
  IconChecklist,
  IconFlame,
  IconInfoCircle,
  IconStar,
  IconSwords,
} from "@tabler/icons-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function InfoPageContent() {
  const searchParams = useSearchParams();
  const section = searchParams.get("section");

  useEffect(() => {
    if (section) {
      const element = document.getElementById(section);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [section]);

  return (
    <Stack my="xl" maw={{ base: "100%", sm: 1040 }} mx="auto">
      <Stack align="center" gap={4}>
        <Title c="#DC143C" ta="center">
          ToB Speed - Info
        </Title>
        <Text c="dimmed" size="sm">
          4 & 5 Man Grandmaster Times
        </Text>
      </Stack>

      <Alert
        icon={<IconInfoCircle size={20} />}
        color="red"
        title="Everyone is Welcome!"
        radius="md"
      >
        <Text size="sm">
          Don&apos;t meet all the requirements? <strong>Ask anyway!</strong> Almost
          anyone can join and successfully get the combat achievement.
        </Text>
      </Alert>

      <PrepareForRun
        basePath="/queues/tob-speed"
        description="Learn the gear, setup, and strategies required to join the Theatre of Blood 4 & 5 man speedruns."
        colors={{
          requirements: "#DC143C",
          setup: "#8B0000",
          strategy: "#6B2D7B",
        }}
      />

      <Card id="gear" withBorder radius="md" p="lg">
        <Group gap="xs" mb="md">
          <IconChecklist size={24} color="#DC143C" />
          <Title order={3}>Requirements & Gear</Title>
        </Group>

        <Text c="dimmed" size="sm" mb="md">
          These items help ensure smooth runs, but alternatives may work.
        </Text>

        <Stack gap="md">
          <Card withBorder radius="sm" p="md" bg="dark.7">
            <Group justify="space-between" mb="xs">
              <Text fw={600}>Scythe of Vitur</Text>
              <Badge color="red" visibleFrom="sm">Recommended</Badge>
            </Group>
            <Text size="sm" c="dimmed">
              Best-in-slot melee weapon for ToB. Essential for fast Nylocas and Verzik phases.
            </Text>
          </Card>

          <Card withBorder radius="sm" p="md" bg="dark.7">
            <Group justify="space-between" mb="xs">
              <Text fw={600}>Zaryte Crossbow</Text>
              <Badge color="red" visibleFrom="sm">Recommended</Badge>
            </Group>
            <Text size="sm" c="dimmed">
              Best spec weapon for Maiden and Verzik P2. Bring your best ranged spec weapon if you don&apos;t have ZCB.
            </Text>
          </Card>

          <Card withBorder radius="sm" p="md" bg="dark.7">
            <Group justify="space-between" mb="xs">
              <Text fw={600}>Dragon Claws</Text>
              <Badge color="red" visibleFrom="sm">Recommended</Badge>
            </Group>
            <Text size="sm" c="dimmed">
              Essential for Verzik P3 specs. One of the most important items for speed runs.
            </Text>
          </Card>
        </Stack>

        <Divider my="md" />

        <Group gap="xs" mb="md">
          <IconStar size={24} color="#6B2D7B" />
          <Title order={4}>Other Requirements</Title>
        </Group>

        <Stack gap="sm">
          <Group gap="sm" align="flex-start">
            <ThemeIcon color="red" size={20} radius="xl">
              <IconCheck size={14} />
            </ThemeIcon>
            <Text style={{ flex: 1 }}>
              <strong>ToB KC:</strong> You&apos;ll need to be comfortable with ToB mechanics and callouts.
            </Text>
          </Group>
          <Group gap="sm" align="flex-start">
            <ThemeIcon color="red" size={20} radius="xl">
              <IconCheck size={14} />
            </ThemeIcon>
            <Text style={{ flex: 1 }}>
              <strong>Discord:</strong> Being in voice chat is essential for coordinating specs and callouts.
            </Text>
          </Group>
          <Group gap="sm" align="flex-start">
            <ThemeIcon color="red" size={20} radius="xl">
              <IconCheck size={14} />
            </ThemeIcon>
            <Text style={{ flex: 1 }}>
              <strong>Supplies:</strong> Match the recommended inventory as closely as possible, ask questions.
            </Text>
          </Group>
        </Stack>
      </Card>

      <Card id="setup" withBorder radius="md" p="lg">
        <Group gap="xs" mb="md">
          <IconFlame size={24} color="#8B0000" />
          <Title order={3}>Setup & Inventory</Title>
        </Group>

        <Text c="dimmed" size="sm" mb="md">
          Optimal gear setups and inventory for 4 & 5 man GM Time runs.
        </Text>

        <Stack gap="md">
          <Card withBorder radius="sm" p="md" bg="dark.7">
            <Text fw={600} mb="xs">4-Man Setup</Text>
            <Text size="sm" c="dimmed">
              Coming soon. Check Discord for current recommendations.
            </Text>
          </Card>

          <Card withBorder radius="sm" p="md" bg="dark.7">
            <Text fw={600} mb="xs">5-Man Setup</Text>
            <Text size="sm" c="dimmed">
              Coming soon. Check Discord for current recommendations.
            </Text>
          </Card>
        </Stack>
      </Card>

      <Card id="strategy" withBorder radius="md" p="lg">
        <Group gap="xs" mb="md">
          <IconSwords size={24} color="#6B2D7B" />
          <Title order={3}>Strategy & Methods</Title>
        </Group>

        <Text c="dimmed" size="sm" mb="md">
          Combat strategies and methods for each room and boss.
        </Text>

        <Stack gap="md">
          <Card withBorder radius="sm" p="md" bg="dark.7">
            <Group gap="xs" mb="xs">
              <IconFlame size={18} color="#DC143C" />
              <Text fw={600}>The Maiden of Sugadinti</Text>
            </Group>
            <Text size="sm" c="dimmed">
              Strategy details coming soon.
            </Text>
          </Card>

          <Card withBorder radius="sm" p="md" bg="dark.7">
            <Group gap="xs" mb="xs">
              <IconFlame size={18} color="#DC143C" />
              <Text fw={600}>Pestilent Bloat</Text>
            </Group>
            <Text size="sm" c="dimmed">
              Strategy details coming soon.
            </Text>
          </Card>

          <Card withBorder radius="sm" p="md" bg="dark.7">
            <Group gap="xs" mb="xs">
              <IconFlame size={18} color="#DC143C" />
              <Text fw={600}>Nylocas</Text>
            </Group>
            <Text size="sm" c="dimmed">
              Strategy details coming soon.
            </Text>
          </Card>

          <Card withBorder radius="sm" p="md" bg="dark.7">
            <Group gap="xs" mb="xs">
              <IconFlame size={18} color="#DC143C" />
              <Text fw={600}>Sotetseg</Text>
            </Group>
            <Text size="sm" c="dimmed">
              Strategy details coming soon.
            </Text>
          </Card>

          <Card withBorder radius="sm" p="md" bg="dark.7">
            <Group gap="xs" mb="xs">
              <IconFlame size={18} color="#DC143C" />
              <Text fw={600}>Xarpus</Text>
            </Group>
            <Text size="sm" c="dimmed">
              Strategy details coming soon.
            </Text>
          </Card>

          <Card withBorder radius="sm" p="md" bg="dark.7">
            <Group gap="xs" mb="xs">
              <IconFlame size={18} color="#DC143C" />
              <Text fw={600}>Verzik Vitur</Text>
            </Group>
            <Text size="sm" c="dimmed">
              Strategy details coming soon.
            </Text>
          </Card>
        </Stack>
      </Card>

      <Card withBorder radius="md" p="lg" bg="dark.8">
        <Stack align="center" gap="md">
          <Title order={3} ta="center">
            Ready to Join?
          </Title>
          <Text ta="center" c="dimmed">
            Head back to the queue page and sign up! Remember, if you&apos;re
            unsure about anything, just ask.
          </Text>
          <Link
            href="/queues/tob-speed"
            style={{
              color: "#DC143C",
              fontWeight: 600,
              textDecoration: "underline",
            }}
          >
            Go to Queue Page
          </Link>
        </Stack>
      </Card>

      <Divider my="sm" />

      <Text size="xs" c="dimmed" ta="center">
        Questions? Reach out on Discord or Twitch. We want everyone to get their
        GM Time!
      </Text>
    </Stack>
  );
}

export default function TobSpeedInfoPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InfoPageContent />
    </Suspense>
  );
}
