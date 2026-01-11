import theme from "@/app/theme";
import AdminQueue from "@/components/queues/AdminQueue";
import AdminStatusSection from "@/components/queues/AdminStatusSection";
import PrepareForRun from "@/components/queues/PrepareForTheRun";
import Queue from "@/components/queues/Queue";
import StatusSection from "@/components/queues/StatusSection";
import { getToa8SpeedQueue, getToa8SpeedSettings } from "@/lib/server/toa-queues";
import { isAdmin } from "@/lib/session";
import { Stack, Title } from "@mantine/core";

export const revalidate = 0;

const TOA8ManPage = async () => {
  const [queue, isUserAdmin, settings] = await Promise.all([
    getToa8SpeedQueue(),
    isAdmin(),
    getToa8SpeedSettings(),
  ]);

  return (
    <Stack align="center" my="xl" maw={1040} w="100%" mx="auto">
      <Title c={theme.colors.warning[3]} mb="md">
        ToA 8-man GM Time
      </Title>
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
      {isUserAdmin ? <AdminQueue players={queue} /> : <Queue players={queue} />}
      <PrepareForRun />
    </Stack>
  );
};

export default TOA8ManPage;
