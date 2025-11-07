import { env } from "@/lib/utils/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/server/db/migration",
  schema: "./src/server/db/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
