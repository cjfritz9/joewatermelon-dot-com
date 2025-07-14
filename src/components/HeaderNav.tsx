"use client";

import logo from "@/assets/melon-logo.png";
import classes from "@/styles/HeaderNav.module.css";
import { getBrandColor } from "@/utils/theme";
import {
  Anchor,
  Box,
  Burger,
  Button,
  Center,
  Collapse,
  Divider,
  Drawer,
  Group,
  HoverCard,
  ScrollArea,
  SimpleGrid,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBrandDiscord,
  IconBrandTwitch,
  IconBrandYoutube,
  IconChevronDown,
  IconGrid4x4,
  IconSword,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

const data = [
  {
    icon: IconBrandTwitch,
    title: "Twitch",
    description: "I'm live!",
    link: "https://twitch.tv/joewatermelon",
  },
  {
    icon: IconBrandYoutube,
    title: "Youtube",
    description: "Guides, end game series, & more",
    link: "https://youtube.com/@joewatermelon",
  },
  {
    icon: IconBrandDiscord,
    title: "Discord",
    description: "Join the discord",
    link: "https://discord.com/invite/BrJfA6q",
  },
  {
    icon: IconSword,
    title: "Combat Achievements",
    description: "Free CA help",
    link: "/combat-achievements",
  },
  {
    icon: IconGrid4x4,
    title: "Bingo",
    description: "Check the status of the next bingo!",
    link: "/bingo",
  },
];

export function HeaderNav() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();

  const links = data.map((item) => {
    const isExternal = item.link.startsWith("http");
    return (
      <Link
        key={item.link}
        href={item.link}
        target={isExternal ? "_blank" : "_self"}
      >
        <UnstyledButton className={classes.subLink}>
          <Group wrap="nowrap" align="flex-start">
            <ThemeIcon size={34} variant="default" radius="md">
              <item.icon size={22} color={getBrandColor(9)} />
            </ThemeIcon>
            <div>
              <Text size="sm" fw={500} c={getBrandColor(3)}>
                {item.title}
              </Text>
              <Text size="xs" c="dimmed">
                {item.description}
              </Text>
            </div>
          </Group>
        </UnstyledButton>
      </Link>
    );
  });

  return (
    <Box pb={48}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Link href="/" className={classes.link}>
            <Image src={logo} alt="logo" height={36} />
          </Link>
          <Group h="100%" gap={0} visibleFrom="sm">
            <Link href="/" className={classes.link}>
              Home
            </Link>
            <HoverCard
              width={600}
              position="bottom"
              radius="md"
              shadow="md"
              withinPortal
            >
              <HoverCard.Target>
                <Link href="/features" className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      Features
                    </Box>
                    <IconChevronDown size={16} color={getBrandColor(4)} />
                  </Center>
                </Link>
              </HoverCard.Target>

              <HoverCard.Dropdown style={{ overflow: "hidden" }}>
                <Group justify="space-between" px="md">
                  <Text fw={500}>Features</Text>
                  <Anchor href="#" fz="xs">
                    View all
                  </Anchor>
                </Group>

                <Divider my="sm" />

                <SimpleGrid cols={2} spacing={0}>
                  {links}
                </SimpleGrid>

                {/* <div className={classes.dropdownFooter}>
                  <Group justify="space-between">
                    <div>
                      <Text fw={500} fz="sm">
                        Get started
                      </Text>
                      <Text size="xs" c="dimmed">
                        Their food sources have decreased, and their numbers
                      </Text>
                    </div>
                    <Button variant="default">Get started</Button>
                  </Group>
                </div> */}
              </HoverCard.Dropdown>
            </HoverCard>
            <Link href="/about" className={classes.link}>
              About
            </Link>
          </Group>

          <Group visibleFrom="sm">
            <Link href="/login">
              <Button variant="default">Log in</Button>
            </Link>
            <Link href="/register">
              <Button color="brand.8">Sign up</Button>
            </Link>
          </Group>

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
          />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h="calc(100vh - 80px" mx="-md">
          <Divider my="sm" />

          <Link href="/" className={classes.link}>
            Home
          </Link>
          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                Features
              </Box>
              <IconChevronDown size={16} />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse>
          <Link href="/about" className={classes.link}>
            About
          </Link>

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            <Link href="/login">
              <Button variant="default">Log in</Button>
            </Link>
            <Link href="/register">
              <Button color="brand.8">Sign up</Button>
            </Link>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
