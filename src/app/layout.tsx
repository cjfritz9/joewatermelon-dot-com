import { DevBanner } from "@/components/global/DevBanner";
import { Footer } from "@/components/global/Footer";
import { HeaderNav } from "@/components/global/HeaderNav";
import { UserProvider } from "@/lib/context/UserContext";
import {
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { Notifications } from "@mantine/notifications";
import type { Metadata } from "next";
import "./globals.css";
import theme from "./theme";

export const metadata: Metadata = {
  title: {
    default: "JoeWatermelon | OSRS Content Creator & Speedrunner",
    template: "%s | JoeWatermelon",
  },
  description:
    "OSRS content creator, GM Ironman, and speedrunner. Join queues for ToA and ToB speed runs, get free Grandmaster Combat Achievement help, and connect with the Melon clan community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className="antialiased">
        <MantineProvider defaultColorScheme="dark" theme={theme}>
        <DevBanner />
          <DatesProvider settings={{ firstDayOfWeek: 0 }}>
            <Notifications />
            <UserProvider>
              <HeaderNav />
              <main className="container">{children}</main>
              <Footer />
            </UserProvider>
          </DatesProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
