import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a JoeWatermelon account to join raid queues, participate in clan bingos, and connect with the community.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
