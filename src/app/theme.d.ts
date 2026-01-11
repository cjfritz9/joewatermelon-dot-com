import type { DefaultMantineColor, MantineColorsTuple } from "@mantine/core";

type ExtendedCustomColors = "brand" | "success" | "error" | "warning" | "info" | DefaultMantineColor;

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, MantineColorsTuple>;
  }
}
