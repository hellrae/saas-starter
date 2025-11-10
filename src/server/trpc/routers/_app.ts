import { createTRPCRouter } from "@/server/trpc/init";
import { authRouter } from "./auth-router";
import { userRouter } from "./user-router";
import { newsletterRouter } from "./newsletter-router";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  newsletter: newsletterRouter,
});

export type AppRouter = typeof appRouter;
