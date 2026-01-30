import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account",
  description:
    "Manage your JoeWatermelon account settings, link your Twitch account, and update your profile.",
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
