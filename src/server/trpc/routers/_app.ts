import { createTRPCRouter } from "@/server/trpc/init";
import { authRouter } from "./auth-router";
import { userRouter } from "./user-router";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
