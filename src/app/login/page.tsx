import AuthWrapper from "@/components/auth/AuthWrapper";
import { LoginForm } from "@/components/auth/LoginForm";
import React from "react";

const LoginPage: React.FC = async () => {
  return (
    <AuthWrapper>
      <LoginForm />
    </AuthWrapper>
  );
};

export default LoginPage;
