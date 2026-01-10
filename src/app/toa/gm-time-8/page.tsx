import theme from "@/app/theme";
import AdminQueue from "@/components/queues/AdminQueue";
import PrepareForRun from "@/components/queues/PrepareForTheRun";
import Queue from "@/components/queues/Queue";
import StatusSection from "@/components/queues/StatusSection";
import { getToa8SpeedQueue } from "@/lib/server/toa-queues";
import { isAdmin } from "@/lib/session";
import { Stack, Title } from "@mantine/core";

export const revalidate = 0;

const TOA8ManPage = async () => {
  const [queue, isUserAdmin] = await Promise.all([
    getToa8SpeedQueue(),
    isAdmin(),
  ]);

  return (
    <Stack align="center" px="xl" my="xl" mx="auto" style={{ width: "100%", maxWidth: 1200, overflow: "hidden" }}>
      <Title c={theme.colors!.warning![3]} mb="md">
        ToA 8-man GM Time
      </Title>
      <StatusSection
        status="inactive"
        nextRunTime={new Date("July 21, 2025 14:00:00")}
      />
      {isUserAdmin ? <AdminQueue players={queue} /> : <Queue players={queue} />}
      <PrepareForRun />
    </Stack>
  );
};

export default TOA8ManPage;
