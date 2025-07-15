"use client";

import { Stack } from "@mantine/core";
import React from "react";

const AuthWrapper = ({ children }: React.PropsWithChildren) => {
  return <Stack align="center">{children}</Stack>;
};

export default AuthWrapper;
