import { TRPCProvider } from "@/lib/trpc/client";
import type React from "react";
import { Toaster } from "sonner";
import Navbar from "./navbar";
import Footer from "./footer";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <TRPCProvider>
      <Toaster />
      <Navbar />
      {children}
      <Footer />
    </TRPCProvider>
  );
};

export default Provider;
