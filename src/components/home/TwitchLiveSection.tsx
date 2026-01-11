"use client";

import { LiveStatus, TwitchVideo } from "@/lib/twitch";
import { Badge, Card, Group, Stack, Text, Title } from "@mantine/core";
import { IconBrandTwitch } from "@tabler/icons-react";

interface TwitchLiveSectionProps {
  liveStatus: LiveStatus;
  latestVod?: TwitchVideo | null;
}

function formatDuration(duration: string): string {
  // Duration format: "1h2m3s" or "2m3s" or "3s"
  const hours = duration.match(/(\d+)h/)?.[1];
  const minutes = duration.match(/(\d+)m/)?.[1];
  const seconds = duration.match(/(\d+)s/)?.[1];

  const parts = [];
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (seconds && !hours) parts.push(`${seconds}s`);

  return parts.join(" ") || duration;
}

export default function TwitchLiveSection({ liveStatus, latestVod }: TwitchLiveSectionProps) {
  const { isLive, stream } = liveStatus;

  if (!isLive && latestVod) {
    return (
      <Card withBorder radius="md" p="lg" w="100%">
        <Group gap="md" align="center" mb="md">
          <IconBrandTwitch size={32} color="#9146FF" />
          <Stack gap={4} style={{ flex: 1 }}>
            <Group gap="xs">
              <Title order={3}>Twitch</Title>
              <Badge color="gray" variant="light">
                Offline
              </Badge>
              <Badge color="gray" variant="light">
                Latest VOD
              </Badge>
            </Group>
            <Text size="sm" fw={500} lineClamp={1}>
              {latestVod.title}
            </Text>
          </Stack>
        </Group>

        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
          <iframe
            src={`https://player.twitch.tv/?video=${latestVod.id}&parent=localhost&parent=joewatermelon.com&autoplay=false`}
            frameBorder="0"
            allowFullScreen
            scrolling="no"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              borderRadius: 8,
            }}
          />
        </div>

        <Group mt="sm" justify="space-between">
          <Text size="xs" c="dimmed">
            {new Date(latestVod.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {" · "}
            {formatDuration(latestVod.duration)}
            {" · "}
            {latestVod.view_count.toLocaleString()} views
          </Text>
          <a
            href="https://twitch.tv/JoeWatermelon"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#9146FF", fontWeight: 600, fontSize: 12 }}
          >
            More Videos
          </a>
        </Group>
      </Card>
    );
  }

  if (!isLive) {
    return (
      <Card withBorder radius="md" p="lg" w="100%">
        <Group gap="md" align="center" mb="md">
          <IconBrandTwitch size={32} color="#9146FF" />
          <Stack gap={4} style={{ flex: 1 }}>
            <Group gap="xs">
              <Title order={3}>Twitch</Title>
              <Badge color="gray" variant="light">
                Offline
              </Badge>
            </Group>
            <Text size="sm" fw={500} lineClamp={1}>
              JoeWatermelon is currently offline
            </Text>
          </Stack>
        </Group>

        <Card withBorder radius="md" p="xl" bg="dark.7" style={{ textAlign: "center" }}>
          <Stack align="center" gap="sm">
            <IconBrandTwitch size={48} color="#9146FF" style={{ opacity: 0.5 }} />
            <Text c="dimmed" size="sm">
              Check back later or follow to get notified!
            </Text>
          </Stack>
        </Card>

        <Group mt="sm" justify="flex-end">
          <a
            href="https://twitch.tv/JoeWatermelon"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#9146FF", fontWeight: 600, fontSize: 12 }}
          >
            Follow on Twitch
          </a>
        </Group>
      </Card>
    );
  }

  return (
    <Card withBorder radius="md" p="lg" w="100%">
      <Group gap="md" align="center" mb="md">
        <IconBrandTwitch size={32} color="#9146FF" />
        <Stack gap={4} style={{ flex: 1 }}>
          <Group gap="xs">
            <Title order={3}>Twitch</Title>
            <Badge
              color="red"
              variant="filled"
              leftSection={
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "white",
                    display: "inline-block",
                  }}
                />
              }
            >
              LIVE
            </Badge>
            {stream && (
              <Badge color="gray" variant="light">
                {stream.viewer_count.toLocaleString()} viewers
              </Badge>
            )}
          </Group>
          {stream && (
            <Text size="sm" fw={500} lineClamp={1}>
              {stream.title}
            </Text>
          )}
        </Stack>
      </Group>

      <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
        <iframe
          src="https://player.twitch.tv/?channel=JoeWatermelon&parent=localhost&parent=joewatermelon.com&muted=true"
          frameBorder="0"
          allowFullScreen
          scrolling="no"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: 8,
          }}
        />
      </div>

      {stream && (
        <Group mt="sm" justify="space-between">
          <Text size="xs" c="dimmed">
            Playing {stream.game_name}
          </Text>
          <a
            href="https://twitch.tv/JoeWatermelon"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#9146FF", fontWeight: 600, fontSize: 12 }}
          >
            Watch on Twitch
          </a>
        </Group>
      )}
    </Card>
  );
}
