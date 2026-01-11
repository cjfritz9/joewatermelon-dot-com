"use client";

import { YouTubeVideo } from "@/lib/youtube";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconBrandYoutube,
  IconClock,
  IconEdit,
  IconEye,
  IconThumbUp,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface YouTubeSectionProps {
  video: YouTubeVideo | null;
  isFeatured: boolean;
  isAdmin?: boolean;
  currentFeaturedId?: string | null;
}

function extractVideoId(input: string): string | null {
  if (!input) return null;

  // Already a video ID (11 characters, alphanumeric with - and _)
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) {
    return input.trim();
  }

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) return match[1];
  }

  return null;
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

function formatViewCount(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1)}K`;
  }
  return count.toLocaleString();
}

export default function YouTubeSection({
  video,
  isFeatured,
  isAdmin,
  currentFeaturedId,
}: YouTubeSectionProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [videoInput, setVideoInput] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleFeatureVideo = async () => {
    const videoId = extractVideoId(videoInput);

    if (!videoId) {
      notifications.show({
        title: "Invalid Input",
        message: "Please enter a valid YouTube video URL or ID.",
        color: "red",
      });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/youtube/featured", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId }),
      });

      if (res.ok) {
        notifications.show({
          title: "Video Featured",
          message: "The featured video has been updated.",
          color: "green",
        });
        close();
        setVideoInput("");
        router.refresh();
      } else {
        notifications.show({
          title: "Error",
          message: "Failed to update featured video.",
          color: "red",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleClearFeatured = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/youtube/featured", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: null }),
      });

      if (res.ok) {
        notifications.show({
          title: "Featured Cleared",
          message: "Now showing the latest upload.",
          color: "green",
        });
        close();
        router.refresh();
      } else {
        notifications.show({
          title: "Error",
          message: "Failed to clear featured video.",
          color: "red",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  if (!video) {
    return (
      <Card withBorder radius="md" p="lg" w="100%">
        <Group gap="md" align="center">
          <IconBrandYoutube size={32} color="#FF0000" />
          <Stack gap={4}>
            <Title order={3}>YouTube</Title>
            <Text size="sm" c="dimmed">
              Check out JoeWatermelon&apos;s YouTube channel for guides and content!
            </Text>
          </Stack>
        </Group>
        <Group mt="md">
          <a
            href="https://youtube.com/@JoeWatermelon"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#FF0000", fontWeight: 600 }}
          >
            Visit YouTube Channel
          </a>
        </Group>
      </Card>
    );
  }

  return (
    <>
      <Card withBorder radius="md" p="lg" w="100%">
        <Group gap="md" align="center" mb="md">
          <IconBrandYoutube size={32} color="#FF0000" />
          <Stack gap={4} style={{ flex: 1 }}>
            <Group gap="xs">
              <Title order={3}>YouTube</Title>
              <Badge color={isFeatured ? "yellow" : "gray"} variant="light">
                {isFeatured ? "Featured" : "Latest Upload"}
              </Badge>
            </Group>
            <Text size="sm" fw={500} lineClamp={1}>
              {video.title}
            </Text>
          </Stack>
          {isAdmin && (
            <ActionIcon variant="subtle" color="gray" onClick={open}>
              <IconEdit size={18} />
            </ActionIcon>
          )}
        </Group>

        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
          <iframe
            src={`https://www.youtube.com/embed/${video.id}`}
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
          <Group gap="md">
            <Group gap={4}>
              <IconEye size={14} color="gray" />
              <Text size="xs" c="dimmed">
                {formatViewCount(video.viewCount)}
              </Text>
            </Group>
            <Group gap={4}>
              <IconThumbUp size={14} color="gray" />
              <Text size="xs" c="dimmed">
                {formatViewCount(video.likeCount)}
              </Text>
            </Group>
            <Group gap={4}>
              <IconClock size={14} color="gray" />
              <Text size="xs" c="dimmed">
                {formatDuration(video.durationSeconds)}
              </Text>
            </Group>
          </Group>
          <a
            href="https://youtube.com/@JoeWatermelon"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#FF0000", fontWeight: 600, fontSize: 12 }}
          >
            More Videos
          </a>
        </Group>
      </Card>

      <Modal opened={opened} onClose={close} title="Feature YouTube Video" centered>
        <Stack>
          <Text size="sm" c="dimmed">
            Enter a YouTube video URL or ID to feature it on the home page. Leave empty and
            click &quot;Show Latest&quot; to display the most recent upload.
          </Text>

          <TextInput
            label="YouTube Video URL or ID"
            placeholder="https://youtube.com/watch?v=... or video ID"
            value={videoInput}
            onChange={(e) => setVideoInput(e.target.value)}
          />

          {currentFeaturedId && (
            <Text size="xs" c="dimmed">
              Currently featuring: {currentFeaturedId}
            </Text>
          )}

          <Group justify="flex-end" mt="md">
            {isFeatured && (
              <Button
                variant="subtle"
                color="gray"
                onClick={handleClearFeatured}
                loading={saving}
              >
                Show Latest
              </Button>
            )}
            <Button color="red" onClick={handleFeatureVideo} loading={saving}>
              Feature Video
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
