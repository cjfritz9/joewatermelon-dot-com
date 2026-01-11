import classes from "@/styles/Footer.module.css";
import { ActionIcon, Anchor, Group } from "@mantine/core";
import {
  IconBrandDiscord,
  IconBrandTwitch,
  IconBrandYoutube,
} from "@tabler/icons-react";
import Link from "next/link";

const links = [
  { link: "#", label: "Contact" },
  { link: "#", label: "Privacy" },
  { link: "#", label: "Store" },
];

export function Footer() {
  const items = links.map((link) => (
    <Anchor c="dimmed" key={link.label} href={link.link} lh={1} size="sm">
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <div className={`${classes.inner} container`}>
        <div />

        <Group className={classes.links}>{items}</Group>

        <Group gap="xs" justify="flex-end" wrap="nowrap">
          <Link href="https://twitch.tv/joewatermelon" target="_blank">
            <ActionIcon size="lg" variant="default" radius="xl">
              <IconBrandTwitch size={18} stroke={1.5} />
            </ActionIcon>
          </Link>
          <Link href="https://youtube.com/@joewatermelon" target="_blank">
            <ActionIcon size="lg" variant="default" radius="xl">
              <IconBrandYoutube size={18} stroke={1.5} />
            </ActionIcon>
          </Link>
          <Link href="https://discord.com/invite/BrJfA6q" target="_blank">
            <ActionIcon size="lg" variant="default" radius="xl">
              <IconBrandDiscord size={18} stroke={1.5} />
            </ActionIcon>
          </Link>
        </Group>
      </div>
    </div>
  );
}
