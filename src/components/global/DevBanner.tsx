import { Box, Text } from "@mantine/core";

const BANNER_HEIGHT = 24;

export function DevBanner() {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <>
      <Box
        style={{
          background: "linear-gradient(90deg, #f59e0b, #ea580c)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: BANNER_HEIGHT,
          zIndex: 9999,
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text size="xs" fw={700} c="white">
          DEVELOPMENT ENVIRONMENT
        </Text>
      </Box>

      <Box style={{ height: BANNER_HEIGHT }} />
    </>
  );
}
