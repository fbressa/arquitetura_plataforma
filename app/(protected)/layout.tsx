"use client";

import PrivateRoute from "@/app/components/PrivateRoute";
import { ReactNode } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <PrivateRoute>
      {children}
    </PrivateRoute>
  );
}
