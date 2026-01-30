import AuthWrapper from "@/components/auth/AuthWrapper";
import { LoginForm } from "@/components/auth/LoginForm";
import { Loader } from "@mantine/core";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Sign in to your JoeWatermelon account to join queues, track your progress, and participate in clan events.",
};

const LoginPage: React.FC = async () => {
  return (
    <AuthWrapper>
      <Suspense fallback={<Loader />}>
        <LoginForm />
      </Suspense>
    </AuthWrapper>
  );
};

export default LoginPage;
