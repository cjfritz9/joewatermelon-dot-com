import theme from "@/app/theme";
import { Card, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { IconChecklist, IconFlame, IconSwords } from "@tabler/icons-react";
import Link from "next/link";

interface InfoLink {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const infoLinks: InfoLink[] = [
  {
    title: "Requirements",
    description: "Requirements to join the teams.",
    icon: <IconChecklist size={32} color={theme.colors.success[6]} />,
    href: "/toa/gm-time-8/info?section=gear",
  },
  {
    title: "Setup & Inventory",
    description: "Optimal combat styles and inventory.",
    icon: <IconFlame size={32} color={theme.colors.error[5]} />,
    href: "/toa/gm-time-8/info?section=setup",
  },
  {
    title: "Strategy & Methods",
    description: "Best combat and prayer strategy.",
    icon: <IconSwords size={32} color={theme.colors.warning[4]} />,
    href: "/toa/gm-time-8/info?section=strategy",
  },
];

export default function PrepareForRun() {
  return (
    <Stack gap="md" align={{ base: "stretch", sm: "center" }} mb="xl" w="100%">
      <Title fw={700} order={3}>
        Prepare for the Run
      </Title>

      <Title size="sm" c="dimmed">
        Learn the gear, setup, and strategies required to join the Tombs of
        Amascut 8-man speedrun.
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mt="sm" w="100%">
        {infoLinks.map((link) => (
          <Link key={link.title} href={link.href} style={{ width: "100%" }}>
            <Card
              shadow="md"
              radius="md"
              p="md"
              withBorder
              style={{ height: "100%" }}
              maw={{ base: "100%", sm: 424 }}
              miw={{ base: "auto", sm: 224 }}
            >
              <Group gap="md" align="center">
                {link.icon}
                <div>
                  <Text fw={600}>{link.title}</Text>
                  <Text size="sm" c="dimmed">
                    {link.description}
                  </Text>
                </div>
              </Group>
            </Card>
          </Link>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
