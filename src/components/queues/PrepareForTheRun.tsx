import { Card, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { IconChecklist, IconFlame, IconSwords } from "@tabler/icons-react";
import Link from "next/link";

interface PrepareForRunProps {
  basePath: string;
  description: string;
  colors: {
    requirements: string;
    setup: string;
    strategy: string;
  };
}

export default function PrepareForRun({
  basePath,
  description,
  colors,
}: PrepareForRunProps) {
  const infoLinks = [
    {
      title: "Requirements",
      description: "Requirements to join the teams.",
      icon: <IconChecklist size={32} color={colors.requirements} />,
      href: `${basePath}/info?section=gear`,
    },
    {
      title: "Setup & Inventory",
      description: "Optimal combat styles and inventory.",
      icon: <IconFlame size={32} color={colors.setup} />,
      href: `${basePath}/info?section=setup`,
    },
    {
      title: "Strategy & Methods",
      description: "Best combat and prayer strategy.",
      icon: <IconSwords size={32} color={colors.strategy} />,
      href: `${basePath}/info?section=strategy`,
    },
  ];

  return (
    <Stack gap="md" mb="xl" w="100%">
      <Title fw={700} order={3}>
        Prepare for the Run
      </Title>

      <Title size="sm" c="dimmed">
        {description}
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
