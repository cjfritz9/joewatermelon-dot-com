"use client";

import { ActionIcon, Button, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useState } from "react";

interface CopyButtonProps {
  value: string;
  label?: string;
  size?: number;
  text?: string;
}

export default function CopyButton({
  value,
  label = "Copy",
  size = 14,
  text,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  if (text) {
    return (
      <Button
        size="xs"
        variant="default"
        color={copied ? "green" : undefined}
        leftSection={
          copied ? <IconCheck size={size} /> : <IconCopy size={size} />
        }
        onClick={handleCopy}
      >
        {copied ? "Copied" : text}
      </Button>
    );
  }

  return (
    <Tooltip label={copied ? "Copied" : label}>
      <ActionIcon
        variant="subtle"
        color={copied ? "green" : "gray"}
        size="sm"
        onClick={handleCopy}
      >
        {copied ? <IconCheck size={size} /> : <IconCopy size={size} />}
      </ActionIcon>
    </Tooltip>
  );
}
