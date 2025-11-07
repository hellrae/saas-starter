import { createAuthClient } from "better-auth/react";
import { env } from "@/lib/utils/env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BASE_URL,
});
