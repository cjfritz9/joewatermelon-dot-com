import {
  AppShell,
  AppShellMain,
  Button,
  Group,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";

export default function Home() {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShellMain>
        <Title className="text-center mt-20">
          <Text
            inherit
            variant="gradient"
            component="span"
            gradient={{ from: "green", to: "pink" }}
          >
            JoeWatermelon
          </Text>
        </Title>
        <Text
          className="text-center text-gray-700 dark:text-gray-300 max-w-[500px] mx-auto mt-xl"
          ta="center"
          size="lg"
          maw={580}
          mx="auto"
          mt="xl"
        >
          This website is a work in progress
        </Text>

        <Title size='h3' className="text-center mt-12">
          <Text
            inherit
            variant="gradient"
            component="span"
          >
            ToA 8 GM Times
          </Text>
        </Title>
        <Group className="flex mt-4 justify-center">
          <Link href="/toa/gm-time-8">
            <Button variant="default">Status & Queue</Button>
          </Link>
          <Link href="/toa/gm-time-8/setup">
            <Button>Setup & Info</Button>
          </Link>
        </Group>
      </AppShellMain>
    </AppShell>
  );
}
