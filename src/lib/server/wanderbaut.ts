const API_URL = process.env.WANDERBAUT_API_URL || "https://api.wanderbaut.app";
const API_KEY = process.env.WANDERBAUT_SITE_KEY;
const CHANNEL = process.env.WANDERBAUT_CHANNEL || "joewatermelon";

export const MAX_CHAT_MESSAGE_LENGTH = 500;

export class ChatSendError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export const isChatSendConfigured = () => !!API_KEY;

export const sendChatMessage = async (message: string): Promise<string> => {
  if (!API_KEY) {
    throw new ChatSendError("Chat sending is not configured", 503);
  }

  const res = await fetch(`${API_URL}/internal/chat/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Internal-Key": API_KEY,
    },
    body: JSON.stringify({ channel: CHANNEL, message }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ChatSendError(
      data?.error || "Wanderbaut could not send the message",
      res.status === 409 ? 409 : 502,
    );
  }

  return data?.message ?? message;
};
