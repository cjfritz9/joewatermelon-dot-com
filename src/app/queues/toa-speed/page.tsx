import theme from "@/app/theme";
import AdminQueue from "@/components/queues/AdminQueue";
import AdminStatusSection from "@/components/queues/AdminStatusSection";
import JoinQueueModal from "@/components/queues/JoinQueueModal";
import PrepareForRun from "@/components/queues/PrepareForTheRun";
import Queue from "@/components/queues/Queue";
import StatusSection from "@/components/queues/StatusSection";
import { toaQueueConfig } from "@/lib/queue-config";
import { getToa8SpeedQueue, getToa8SpeedSettings } from "@/lib/server/toa-queues";
import { isAdmin } from "@/lib/session";
import { Stack, Text, Title } from "@mantine/core";

export const revalidate = 0;

const ToaSpeedQueuePage = async () => {
  const [queue, isUserAdmin, settings] = await Promise.all([
    getToa8SpeedQueue(),
    isAdmin(),
    getToa8SpeedSettings(),
  ]);

  return (
    <Stack align="center" my="xl" maw={1040} w="100%" mx="auto">
      <Stack align="center" gap={4} mb="md">
        <Title c={theme.colors.warning[3]}>
          ToA Speed
        </Title>
        <Text c="dimmed" size="sm">
          8 Man Grandmaster Time
        </Text>
      </Stack>
      {isUserAdmin ? (
        <AdminStatusSection
          initialStatus={settings.status}
          initialNextRunTime={settings.nextRunTime}
        />
      ) : (
        <StatusSection
          status={settings.status}
          nextRunTime={settings.nextRunTime ?? undefined}
        />
      )}
      {isUserAdmin ? (
        <AdminQueue players={queue as unknown as Record<string, unknown>[]} config={toaQueueConfig} />
      ) : (
        <Queue
          players={queue as unknown as Record<string, unknown>[]}
          config={toaQueueConfig}
          joinModal={<JoinQueueModal config={toaQueueConfig} />}
        />
      )}
      <PrepareForRun
        basePath="/queues/toa-speed"
        description="Learn the gear, setup, and strategies required to join the Tombs of Amascut 8-man speedrun."
        colors={{
          requirements: theme.colors.success[6],
          setup: theme.colors.error[5],
          strategy: theme.colors.warning[4],
        }}
      />
    </Stack>
  );
};

export default ToaSpeedQueuePage;
