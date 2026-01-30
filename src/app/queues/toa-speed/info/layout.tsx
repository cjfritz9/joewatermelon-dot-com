import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ToA Speed Guide",
  description:
    "Learn how to prepare for Tombs of Amascut 8-man Grandmaster speed runs. Gear requirements, strategy tips, and what to expect.",
};

export default function ToaInfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
