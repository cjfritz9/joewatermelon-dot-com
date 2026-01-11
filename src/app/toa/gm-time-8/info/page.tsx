"use client";

import theme from "@/app/theme";
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
    <Stack my="xl" maw={{ base: "100%", sm: 800 }} mx="auto">
      <Title c={theme.colors.warning[3]} ta="center">
        ToA 8-man GM Time - Info
      </Title>

      <Alert
        icon={<IconInfoCircle size={20} />}
        color="green"
        title="Everyone is Welcome!"
        radius="md"
      >
        <Text size="sm">
          Don&apos;t meet all the requirements? <strong>Ask anyway!</strong> Almost
          anyone can join and successfully get the combat achievement.
        </Text>
      </Alert>

      <PrepareForRun />

      <Card id="gear" withBorder radius="md" p="lg">
        <Group gap="xs" mb="md">
          <IconChecklist size={24} color={theme.colors.success[6]} />
          <Title order={3}>Requirements & Gear</Title>
        </Group>

        <Text c="dimmed" size="sm" mb="md">
          These items help ensure smooth runs, but alternatives may work.
        </Text>

        <Stack gap="md">
          <Card withBorder radius="sm" p="md" bg="dark.7">
            <Group justify="space-between" mb="xs">
              <Text fw={600}>Keris Partisan of Corruption</Text>
              <Badge color="yellow" visibleFrom="sm">Recommended</Badge>
            </Group>
            <Text size="sm" c="dimmed">
              Two red keris are required for the run.
            </Text>
          </Card>

          <Card withBorder radius="sm" p="md" bg="dark.7">
            <Group justify="space-between" mb="xs">
              <Text fw={600}>Bandos Godsword</Text>
              <Badge color="yellow" visibleFrom="sm">Recommended</Badge>
            </Group>
            <Text size="sm" c="dimmed">
              Required for the BGS role, unless the team is running the magic strategy.
            </Text>
          </Card>

          <Card withBorder radius="sm" p="md" bg="dark.7">
            <Group justify="space-between" mb="xs">
              <Text fw={600}>Zaryte Crossbow</Text>
              <Badge color="yellow" visibleFrom="sm">Recommended</Badge>
            </Group>
            <Text size="sm" c="dimmed">
              Best-in-slot spec weapon. If you don&apos;t have this you&apos;ll likely be placed on a keris/defence reduction role. Bring your best ToA spec weapon.
            </Text>
          </Card>
        </Stack>

        <Divider my="md" />

        <Group gap="xs" mb="md">
          <IconStar size={24} color={theme.colors.warning[4]} />
          <Title order={4}>Other Requirements</Title>
        </Group>

        <Stack gap="sm">
          <Group gap="sm" align="flex-start">
            <ThemeIcon color="green" size={20} radius="xl">
              <IconCheck size={14} />
            </ThemeIcon>
            <Text style={{ flex: 1 }}>
              <strong>Expert Mode KC:</strong> You&apos;ll need to be comfy with the invocations we run, especially insanity.
            </Text>
          </Group>
          <Group gap="sm" align="flex-start">
            <ThemeIcon color="green" size={20} radius="xl">
              <IconCheck size={14} />
            </ThemeIcon>
            <Text style={{ flex: 1 }}>
              <strong>Discord:</strong> Being in voice chat helps coordinate all the specs and venges. This is a hard requirement.
            </Text>
          </Group>
          <Group gap="sm" align="flex-start">
            <ThemeIcon color="green" size={20} radius="xl">
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
          <IconFlame size={24} color={theme.colors.error[5]} />
          <Title order={3}>Setup & Inventory</Title>
        </Group>

        <Text c="dimmed" size="sm" mb="md">
          Optimal gear setups and inventory for the 8-man GM Time run.
        </Text>

        <Stack gap="md">
          <Card withBorder radius="sm" p="md" bg="dark.7">
            <Text fw={600} mb="xs">Red Keris Role</Text>
            <Text size="sm" c="dimmed">
              Coming soon. Check Discord for current recommendations.
            </Text>
          </Card>

          <Card withBorder radius="sm" p="md" bg="dark.7">
            <Text fw={600} mb="xs">BGS Role</Text>
            <Text size="sm" c="dimmed">
              Coming soon. Check Discord for current recommendations.
            </Text>
          </Card>

          <Card withBorder radius="sm" p="md" bg="dark.7">
            <Text fw={600} mb="xs">Ayak Role</Text>
            <Text size="sm" c="dimmed">
              Coming soon. Check Discord for current recommendations.
            </Text>
          </Card>

          <Card withBorder radius="sm" p="md" bg="dark.7">
            <Text fw={600} mb="xs">DPS Role</Text>
            <Text size="sm" c="dimmed">
              Coming soon. Check Discord for current recommendations.
            </Text>
          </Card>
        </Stack>
      </Card>

      <Card id="strategy" withBorder radius="md" p="lg">
        <Group gap="xs" mb="md">
          <IconSwords size={24} color={theme.colors.warning[4]} />
          <Title order={3}>Strategy & Methods</Title>
        </Group>

        <Text c="dimmed" size="sm" mb="md">
          Combat strategies and methods for each room and boss.
        </Text>

        <Stack gap="md">
          <Card withBorder radius="sm" p="md" bg="dark.7">
            <Group gap="xs" mb="xs">
              <IconFlame size={18} color={theme.colors.error[5]} />
              <Text fw={600}>Zebak</Text>
            </Group>
            <Text size="sm" c="dimmed">
              Strategy details coming soon.
            </Text>
          </Card>

          <Card withBorder radius="sm" p="md" bg="dark.7">
            <Group gap="xs" mb="xs">
              <IconFlame size={18} color={theme.colors.error[5]} />
              <Text fw={600}>Kephri</Text>
            </Group>
            <Text size="sm" c="dimmed">
              Strategy details coming soon.
            </Text>
          </Card>

          <Card withBorder radius="sm" p="md" bg="dark.7">
            <Group gap="xs" mb="xs">
              <IconFlame size={18} color={theme.colors.error[5]} />
              <Text fw={600}>Ba-Ba</Text>
            </Group>
            <Text size="sm" c="dimmed">
              Strategy details coming soon.
            </Text>
          </Card>

          <Card withBorder radius="sm" p="md" bg="dark.7">
            <Group gap="xs" mb="xs">
              <IconFlame size={18} color={theme.colors.error[5]} />
              <Text fw={600}>Akkha</Text>
            </Group>
            <Text size="sm" c="dimmed">
              Strategy details coming soon.
            </Text>
          </Card>

          <Card withBorder radius="sm" p="md" bg="dark.7">
            <Group gap="xs" mb="xs">
              <IconFlame size={18} color={theme.colors.error[5]} />
              <Text fw={600}>Wardens</Text>
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
            href="/toa/gm-time-8"
            style={{
              color: theme.colors.warning[4],
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

export default function TOA8ManInfoPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InfoPageContent />
    </Suspense>
  );
}
