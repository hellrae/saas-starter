import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { account, session, user, verification } from "@/server/db/schema";
import db from "@/server/db";
import { email } from "@/server/email";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, url, newEmail }) => {
        await email.verification.changeEmailVerification({
          to: user.email,
          name: user.name,
          oldEmail: user.email,
          newEmail,
          verificationUrl: url,
        });
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    onPasswordReset: async ({ user }) => {
      await email.password.passwordChangedAck({
        to: user.email,
        name: user.name,
      });
    },
    sendResetPassword: async ({ user, url }) => {
      await email.password.passwordResetRequest({
        to: user.email,
        name: user.name,
        resetUrl: url,
      });
    },
  },
  plugins: [nextCookies()],
});
