import {
  AppShell,
  AppShellMain,
  Button,
  Group,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import theme from "./theme";

export default function Home() {
  return (
    <AppShell padding="sm">
      <AppShellMain>
        {/* <Title className="text-center mt-6">
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
          mt="md"
        >
          This website is a work in progress
        </Text> */}

        <Title size="h3" className="text-center mt-12">
          <Text
            inherit
            variant="text"
            component="span"
            c={theme.colors.warning[5]}
          >
            ToA 8 GM Times
          </Text>
        </Title>
        <Group className="flex mt-4 justify-center">
          <Link href="/toa/gm-time-8">
            <Button color='brand.7'>Status & Queue</Button>
          </Link>
          <Link href="/toa/gm-time-8/info">
            <Button color='brand.5'>Setup & Info</Button>
          </Link>
        </Group>
      </AppShellMain>
    </AppShell>
  );
}
