import { createTRPCRouter } from "@/server/trpc/init";
import { authRouter } from "./auth-router";

export const appRouter = createTRPCRouter({
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
