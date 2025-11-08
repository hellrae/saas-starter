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
      async sendChangeEmailVerification({ user, url, newEmail }) {
        await email.emailVerification.requestEmailChangeApproval({
          to: user.email,
          name: user.name,
          requestedEmail: newEmail,
          approvalUrl: url,
        });
      },
    },
  },
  emailVerification: {
    async afterEmailVerification(user) {
      await email.emailVerification.sendEmailVerifiedNotification({
        name: user.name,
        to: user.email,
        newEmail: user.email,
      });
    },
    async sendVerificationEmail({ user, url }) {
      await email.emailVerification.sendVerificationToEmail({
        name: user.name,
        to: user.email,
        newEmail: user.email,
        verificationUrl: url,
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 43200, // 12 hour
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    async onPasswordReset({ user }) {
      await email.password.passwordChangedAck({
        to: user.email,
        name: user.name,
      });
    },
    async sendResetPassword({ user, url }) {
      await email.password.passwordResetRequest({
        to: user.email,
        name: user.name,
        resetUrl: url,
      });
    },
  },
  plugins: [nextCookies()],
});
