import theme from "@/app/theme";
import JoinQueueModal from "@/components/queues/JoinQueueModal";
import PrepareForRun from "@/components/queues/PrepareForTheRun";
import Queue from "@/components/queues/Queue";
import StatusSection from "@/components/queues/StatusSection";
import { Stack, Title } from "@mantine/core";
import React from "react";

const TOA8ManPage: React.FC = async () => {
  return (
    <Stack align="center" mx="xl" my="xl">
      <Title c={theme.colors!.warning![3]} mb="md">
        ToA 8-man GM Time
      </Title>
      <StatusSection
        status="inactive"
        nextRunTime={new Date("July 21, 2025 14:00:00")}
      />
      <PrepareForRun />
      <Queue
        players={[
          { position: 1, name: "Dead Point", status: "ready" },
          { position: 2, name: "KoiTris", status: "not ready" },
        ]}
      />
      <JoinQueueModal />
    </Stack>
  );
};

export default TOA8ManPage;
