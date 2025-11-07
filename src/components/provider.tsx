import { TRPCProvider } from "@/lib/trpc/client";
import type React from "react";
import { Toaster } from "sonner";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <TRPCProvider>
      <Toaster />
      {children}
    </TRPCProvider>
  );
};

export default Provider;
