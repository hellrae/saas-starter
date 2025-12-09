import { createTRPCRouter } from "@/server/trpc/init";
import { authRouter } from "./auth-router";
import { userRouter } from "./user-router";
import { newsletterRouter } from "./newsletter-router";
import { fileUploadRouter } from "./file-upload-router";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  fileUpload: fileUploadRouter,
  newsletter: newsletterRouter,
});

export type AppRouter = typeof appRouter;
