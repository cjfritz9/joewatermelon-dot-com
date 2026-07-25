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
    <Stack my="xl" maw={{ base: "100%", sm: 1040 }} mx="auto">
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
          Don&apos;t meet all the requirements? <strong>Ask anyway!</strong>{" "}
          Almost anyone can join and successfully get the combat achievement.
        </Text>
      </Alert>

      <PrepareForRun
        basePath="/queues/toa-speed"
        description="Learn the gear, setup, and strategies required to join the Tombs of Amascut 8-man speedrun."
        colors={{
          requirements: theme.colors.success[6],
          setup: theme.colors.error[5],
          strategy: theme.colors.warning[4],
        }}
      />

      <Card id="gear" withBorder radius="md" p="lg">
        <Group gap="xs" mb="md">
          <IconChecklist size={24} color={theme.colors.success[6]} />
          <Title order={3}>Requirements & Gear</Title>
        </Group>

        <Text c="dimmed" size="sm" mb="md">
          What you&apos;ll need to join, plus the gear we recommend bringing.
        </Text>

        <Stack gap="md">
          <Card
            withBorder
            radius="sm"
            p="md"
            bg="dark.7"
            style={{ borderLeft: `3px solid ${theme.colors.success[6]}` }}
          >
            <Group gap="sm" align="flex-start" wrap="nowrap">
              <ThemeIcon color="green" size={26} radius="xl">
                <IconCheck size={16} />
              </ThemeIcon>
              <div style={{ flex: 1 }}>
                <Text fw={600}>Expert Mode KC</Text>
                <Text size="sm" c="dimmed">
                  You&apos;ll need to be comfy with the invocations we run,
                  especially insanity.
                </Text>
              </div>
            </Group>
          </Card>

          <Card
            withBorder
            radius="sm"
            p="md"
            bg="dark.7"
            style={{ borderLeft: `3px solid ${theme.colors.success[6]}` }}
          >
            <Group gap="sm" align="flex-start" wrap="nowrap">
              <ThemeIcon color="green" size={26} radius="xl">
                <IconCheck size={16} />
              </ThemeIcon>
              <div style={{ flex: 1 }}>
                <Text fw={600}>Discord</Text>
                <Text size="sm" c="dimmed">
                  Being in voice chat helps coordinate all the specs and venges.
                  This is a hard requirement.
                </Text>
              </div>
            </Group>
          </Card>

          <Card
            withBorder
            radius="sm"
            p="md"
            bg="dark.7"
            style={{ borderLeft: `3px solid ${theme.colors.success[6]}` }}
          >
            <Group gap="sm" align="flex-start" wrap="nowrap">
              <ThemeIcon color="green" size={26} radius="xl">
                <IconCheck size={16} />
              </ThemeIcon>
              <div style={{ flex: 1 }}>
                <Text fw={600}>Supplies</Text>
                <Text size="sm" c="dimmed">
                  Match the recommended inventory as closely as possible, ask
                  questions.
                </Text>
              </div>
            </Group>
          </Card>
        </Stack>

        <Divider my="md" />

        <Group gap="xs" mb="sm">
          <IconStar size={18} color={theme.colors.warning[4]} />
          <Title order={5} c="dimmed">
            Recommended Gear
          </Title>
        </Group>

        <Stack gap="sm">
          <Group justify="space-between" wrap="nowrap" align="flex-start">
            <div style={{ flex: 1 }}>
              <Text size="sm" fw={500}>
                Keris Partisan of Corruption
              </Text>
              <Text size="xs" c="dimmed">
                Two red keris are required for the run.
              </Text>
            </div>
            <Badge size="sm" variant="light" color="gray" visibleFrom="sm">
              Recommended
            </Badge>
          </Group>

          <Group justify="space-between" wrap="nowrap" align="flex-start">
            <div style={{ flex: 1 }}>
              <Text size="sm" fw={500}>
                Tumeken&apos;s Shadow
              </Text>
              <Text size="xs" c="dimmed">
                Optional, but recommended.
              </Text>
            </div>
            <Badge size="sm" variant="light" color="gray" visibleFrom="sm">
              Recommended
            </Badge>
          </Group>

          <Group justify="space-between" wrap="nowrap" align="flex-start">
            <div style={{ flex: 1 }}>
              <Text size="sm" fw={500}>
                Zaryte Crossbow
              </Text>
              <Text size="xs" c="dimmed">
                Best-in-slot spec weapon. If you don&apos;t have this you&apos;ll
                likely be placed on a keris/defence reduction role. Bring your
                best ToA spec weapon.
              </Text>
            </div>
            <Badge size="sm" variant="light" color="gray" visibleFrom="sm">
              Recommended
            </Badge>
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
            <Text fw={600} mb="xs">
              Red Keris Role
            </Text>
            <Text size="sm" c="dimmed">
              Coming soon. Check Discord for current recommendations.
            </Text>
          </Card>

          <Card withBorder radius="sm" p="md" bg="dark.7">
            <Text fw={600} mb="xs">
              Shadow Role
            </Text>
            <Text size="sm" c="dimmed">
              Coming soon. Check Discord for current recommendations.
            </Text>
          </Card>

          <Card withBorder radius="sm" p="md" bg="dark.7">
            <Text fw={600} mb="xs">
              Ayak Role
            </Text>
            <Text size="sm" c="dimmed">
              Coming soon. Check Discord for current recommendations.
            </Text>
          </Card>

          <Card withBorder radius="sm" p="md" bg="dark.7">
            <Text fw={600} mb="xs">
              DPS Role
            </Text>
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
            href="/queues/toa-speed"
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

export default function ToaSpeedInfoPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InfoPageContent />
    </Suspense>
  );
}
