import APIResponse from "@/lib/classes/APIResponse";
import { canEditQueue } from "@/lib/session";
import {
  ChatSendError,
  MAX_CHAT_MESSAGE_LENGTH,
  sendChatMessage,
} from "@/lib/server/wanderbaut";

export async function POST(req: Request) {
  try {
    if (!(await canEditQueue())) {
      return APIResponse.error("Unauthorized", 401);
    }

    const body = await req.json();
    const { message } = body;

    if (typeof message !== "string" || !message.trim()) {
      return APIResponse.error("Invalid message");
    }

    if (message.length > MAX_CHAT_MESSAGE_LENGTH) {
      return APIResponse.error(
        `Message exceeds ${MAX_CHAT_MESSAGE_LENGTH} characters`,
      );
    }

    const sent = await sendChatMessage(message);

    return APIResponse.success("Message sent to chat", { message: sent });
  } catch (err) {
    if (err instanceof ChatSendError) {
      return APIResponse.error(err.message, err.status);
    }
    console.error(err);
    return APIResponse.error("Internal Server Error", 500);
  }
}
