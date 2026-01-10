import AuthWrapper from "@/components/auth/AuthWrapper";
import { LoginForm } from "@/components/auth/LoginForm";
import { Loader, LoadingOverlay } from "@mantine/core";
import React, { Suspense } from "react";

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
