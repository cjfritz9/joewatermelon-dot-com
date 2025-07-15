import { getBrandColor } from "@/lib/theme";
import { Badge, Button, Card, Group, Stack, Text } from "@mantine/core";

type Status = "active" | "inactive";

interface StatusSectionProps {
  status: Status;
  nextRunTime?: Date;
  onNotify?: () => void;
}

export default function StatusSection({
  status,
  nextRunTime,
  onNotify,
}: StatusSectionProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "active":
        return <Badge color="green">Active</Badge>;
      case "inactive":
        return <Badge color="red">Inactive</Badge>;
    }
  };

  const getFormattedLocalTime = (_date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZoneName: "short",
    }).format(_date);
  };

  const getNextRunText = () => {
    if (status === "active") return "Runs are currently in progress!";
    if (status === "inactive" && nextRunTime)
      return getFormattedLocalTime(nextRunTime);
    if (status === "inactive") return "Next run: TBD";
  };

  return (
    <Card shadow="md" mb="xl" radius="md" p="lg" maw={400} withBorder>
      <Stack gap="xs" align="center">
        <Group align="center">
          <Text fw={700} size="lg">
            Current Status:
          </Text>
          {getStatusBadge()}
        </Group>

        <Text>Next planned runs:</Text>
        <Text fw={700} c={getBrandColor(7)}>
          {getNextRunText()}
        </Text>

        <Button
          mt="md"
          variant="light"
          color="yellow"
          onClick={onNotify}
          disabled
        >
          Notify me when active
        </Button>
      </Stack>
    </Card>
  );
}
