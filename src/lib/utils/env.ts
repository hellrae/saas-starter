import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]),
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(1),
    DOMAIN_NAME: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),

    // AWS
    AWS_S3_REGION_NAME: z.string().min(1),
    AWS_S3_IAM_ACCESS_ID: z.string().min(1),
    AWS_S3_IAM_SECRET_ACCESS_KEY: z.string().min(1),
    AWS_S3_BUCKET_NAME: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().min(1),
    NEXT_PUBLIC_BETTER_AUTH_URL: z.string().min(1),
    NEXT_PUBLIC_ASSETS_SERVING_URL: z.string().min(1),
  },
  runtimeEnv: {
    // Server Side
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    DOMAIN_NAME: process.env.DOMAIN_NAME,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,

    // AWS
    AWS_S3_REGION_NAME: process.env.AWS_S3_REGION_NAME,
    AWS_S3_IAM_ACCESS_ID: process.env.AWS_S3_IAM_ACCESS_ID,
    AWS_S3_IAM_SECRET_ACCESS_KEY: process.env.AWS_S3_IAM_SECRET_ACCESS_KEY,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,

    // Client Accessible
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    NEXT_PUBLIC_ASSETS_SERVING_URL: process.env.NEXT_PUBLIC_ASSETS_SERVING_URL,
  },
});
