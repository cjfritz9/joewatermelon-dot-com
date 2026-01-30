import AdminQueue from "@/components/queues/AdminQueue";
import AdminStatusSection from "@/components/queues/AdminStatusSection";
import JoinQueueModal from "@/components/queues/JoinQueueModal";
import PrepareForRun from "@/components/queues/PrepareForTheRun";
import Queue from "@/components/queues/Queue";
import StatusSection from "@/components/queues/StatusSection";
import { tobQueueConfig } from "@/lib/queue-config";
import { getTobSpeedQueue, getTobSpeedSettings } from "@/lib/server/tob-queues";
import { canEditQueue, isAdmin } from "@/lib/session";
import { Stack, Text, Title } from "@mantine/core";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ToB Speed Queue",
  description:
    "Join the Theatre of Blood 4 & 5-man Grandmaster speed run queue. Sign up and get notified when it's your turn to raid.",
};

export const revalidate = 0;

export default async function TobSpeedQueuePage() {
  const [queue, isUserAdmin, userCanEditQueue, settings] = await Promise.all([
    getTobSpeedQueue(),
    isAdmin(),
    canEditQueue(),
    getTobSpeedSettings(),
  ]);

  return (
    <Stack align="center" my="xl" maw={1040} w="100%" mx="auto">
      <Stack align="center" gap={4}>
        <Title c="#DC143C">ToB Speed</Title>
        <Text c="dimmed" size="sm">
          4 & 5 Man Grandmaster Times
        </Text>
      </Stack>
      {isUserAdmin ? (
        <AdminStatusSection
          initialStatus={settings.status}
          initialNextRunTime={settings.nextRunTime}
          apiEndpoint="/api/queues/tob-speed/settings"
        />
      ) : (
        <StatusSection
          status={settings.status}
          nextRunTime={settings.nextRunTime ?? undefined}
        />
      )}
      {userCanEditQueue ? (
        <AdminQueue
          players={queue as unknown as Record<string, unknown>[]}
          config={tobQueueConfig}
        />
      ) : (
        <Queue
          players={queue as unknown as Record<string, unknown>[]}
          config={tobQueueConfig}
          joinModal={
            <JoinQueueModal
              key="join-modal"
              status={settings.status}
              config={tobQueueConfig}
            />
          }
        />
      )}
      <PrepareForRun
        basePath="/queues/tob-speed"
        description="Learn the gear, setup, and strategies required to join the Theatre of Blood 4 & 5 man speedruns."
        colors={{
          requirements: "#DC143C",
          setup: "#8B0000",
          strategy: "#6B2D7B",
        }}
      />
    </Stack>
  );
}
