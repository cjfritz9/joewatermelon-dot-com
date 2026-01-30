import theme from "@/app/theme";
import { Metadata } from "next";
import {
  Anchor,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconBrandDiscord,
  IconBrandTwitch,
  IconBrandYoutube,
} from "@tabler/icons-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet JoeWatermelon - OSRS content creator, speedrunner, and combat achiever. Streaming ToA and ToB speed runs and helping players get Grandmaster times.",
};

const socials = [
  {
    icon: IconBrandTwitch,
    label: "Twitch",
    href: "https://twitch.tv/joewatermelon",
    color: "#9146FF",
  },
  {
    icon: IconBrandYoutube,
    label: "YouTube",
    href: "https://youtube.com/@joewatermelon",
    color: "#FF0000",
  },
  {
    icon: IconBrandDiscord,
    label: "Discord",
    href: "https://discord.com/invite/BrJfA6q",
    color: "#5865F2",
  },
];

export default function AboutPage() {
  return (
    <Stack align="center" my="xl" maw={700} w="100%" mx="auto" gap="xl">
      <Stack align="center" gap="xs">
        <Title
          order={1}
          className="gradient-text"
          style={{
            backgroundImage: `linear-gradient(135deg, ${theme.colors.brand[3]} 0%, ${theme.colors.brand[7]} 100%)`,
          }}
        >
          About
        </Title>
        <Text c="dimmed" ta="center">
          The man behind the melon
        </Text>
      </Stack>

      <Card withBorder radius="md" p="xl" w="100%">
        <Stack gap="md">
          <Text>
            Hey, I&apos;m <strong>JoeWatermelon</strong> - an OSRS content
            creator, speedrunner, and combat achiever.
          </Text>
          <Text>
            I stream on Twitch where I help players get their Grandmaster Combat
            Achievement speed times for raids like ToA and ToB. The queues on
            this site let you sign up and get notified when it&apos;s your turn.
          </Text>
          <Text>
            When I&apos;m not running speeds, you&apos;ll find me making YouTube
            guides, hanging out with friends in the Melon clan, or working on my
            end-game ironman goals.
          </Text>
        </Stack>
      </Card>

      <Stack w="100%" gap="md">
        <Title order={3} ta="center">
          Connect
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          {socials.map((social) => (
            <Anchor
              key={social.label}
              href={social.href}
              target="_blank"
              underline="never"
            >
              <Card
                withBorder
                radius="md"
                p="md"
                className="hover-card"
                style={{ cursor: "pointer" }}
              >
                <Group justify="center" gap="sm">
                  <ThemeIcon size={32} radius="md" variant="light" color="gray">
                    <social.icon size={20} color={social.color} />
                  </ThemeIcon>
                  <Text fw={500}>{social.label}</Text>
                </Group>
              </Card>
            </Anchor>
          ))}
        </SimpleGrid>
      </Stack>

      <Text size="sm" c="dimmed" ta="center">
        Want to get involved?{" "}
        <Link href="/queues" style={{ color: theme.colors.brand[4] }}>
          Join a queue
        </Link>{" "}
        or hop in the Discord.
      </Text>
    </Stack>
  );
}
