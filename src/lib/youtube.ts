import firestore, { isFirestoreAvailable } from "./db/firestore";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_HANDLE = "@JoeWatermelon";

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  channelTitle: string;
}

interface YouTubeSearchItem {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: { high: { url: string } };
    publishedAt: string;
    channelTitle: string;
  };
}

interface YouTubeVideoItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: { high: { url: string } };
    publishedAt: string;
    channelTitle: string;
  };
  contentDetails?: {
    duration: string;
  };
}

function parseDurationToSeconds(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

// Cache channel ID to avoid repeated lookups
let cachedChannelId: string | null = null;

async function getChannelId(): Promise<string | null> {
  if (!YOUTUBE_API_KEY) return null;
  if (cachedChannelId) return cachedChannelId;

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${YOUTUBE_CHANNEL_HANDLE}&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      console.error("Failed to get channel ID:", await response.text());
      return null;
    }

    const data = await response.json();
    if (data.items && data.items.length > 0) {
      cachedChannelId = data.items[0].id;
      return cachedChannelId;
    }

    return null;
  } catch (error) {
    console.error("Error getting channel ID:", error);
    return null;
  }
}

export async function getLatestVideo(): Promise<YouTubeVideo | null> {
  try {
    const channelId = await getChannelId();
    if (!channelId) return null;

    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=10&order=date&type=video&key=${YOUTUBE_API_KEY}`,
      { next: { revalidate: 300 } }
    );

    if (!searchResponse.ok) {
      console.error("Failed to get latest videos:", await searchResponse.text());
      return null;
    }

    const searchData = await searchResponse.json();
    if (!searchData.items || searchData.items.length === 0) return null;

    const videoIds = searchData.items
      .map((item: YouTubeSearchItem) => item.id.videoId)
      .join(",");

    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`,
      { next: { revalidate: 300 } }
    );

    if (!videosResponse.ok) {
      console.error("Failed to get video details:", await videosResponse.text());
      return null;
    }

    const videosData = await videosResponse.json();
    const nonShort = videosData.items?.find((item: YouTubeVideoItem) => {
      const duration = item.contentDetails?.duration || "PT0S";
      return parseDurationToSeconds(duration) > 60;
    });

    if (nonShort) {
      return {
        id: nonShort.id,
        title: nonShort.snippet.title,
        description: nonShort.snippet.description,
        thumbnailUrl: nonShort.snippet.thumbnails.high.url,
        publishedAt: nonShort.snippet.publishedAt,
        channelTitle: nonShort.snippet.channelTitle,
      };
    }

    return null;
  } catch (error) {
    console.error("Error getting latest video:", error);
    return null;
  }
}

export async function getVideoById(videoId: string): Promise<YouTubeVideo | null> {
  if (!YOUTUBE_API_KEY) return null;

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`,
      { next: { revalidate: 300 } }
    );

    if (!response.ok) {
      console.error("Failed to get video:", await response.text());
      return null;
    }

    const data = await response.json();
    if (data.items && data.items.length > 0) {
      const item: YouTubeVideoItem = data.items[0];
      return {
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails.high.url,
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
      };
    }

    return null;
  } catch (error) {
    console.error("Error getting video by ID:", error);
    return null;
  }
}

export interface FeaturedVideoSettings {
  featuredVideoId: string | null;
}

export async function getFeaturedVideoSettings(): Promise<FeaturedVideoSettings> {
  if (!isFirestoreAvailable) return { featuredVideoId: null };

  try {
    const doc = await firestore.collection("settings").doc("youtube").get();

    if (!doc.exists) {
      return { featuredVideoId: null };
    }

    const data = doc.data();
    return {
      featuredVideoId: data?.featuredVideoId || null,
    };
  } catch (error) {
    console.error("Error getting featured video settings:", error);
    return { featuredVideoId: null };
  }
}

export async function setFeaturedVideoId(videoId: string | null): Promise<boolean> {
  if (!isFirestoreAvailable) return false;

  try {
    await firestore.collection("settings").doc("youtube").set(
      { featuredVideoId: videoId },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error("Error setting featured video:", error);
    return false;
  }
}

export async function getFeaturedOrLatestVideo(): Promise<YouTubeVideo | null> {
  const settings = await getFeaturedVideoSettings();

  if (settings.featuredVideoId) {
    const featuredVideo = await getVideoById(settings.featuredVideoId);
    if (featuredVideo) return featuredVideo;
  }

  return getLatestVideo();
}
