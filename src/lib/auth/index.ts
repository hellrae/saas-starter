import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { account, session, user, verification } from "@/server/db/schema";
import db from "@/server/db";
import { email, safeSend } from "@/server/email";

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
    additionalFields: {
      isDeleted: { type: "boolean", default: false },
    },
    changeEmail: {
      enabled: true,
      async sendChangeEmailVerification({ user, url, newEmail }) {
        const response = await safeSend(() =>
          email.emailVerification.requestEmailChangeApproval({
            to: user.email,
            name: user.name,
            requestedEmail: newEmail,
            approvalUrl: url,
          }),
        );

        if (response.error) {
          console.error("ChangeEmailVerification failed:", response.error);
          throw new Error(
            response.error.statusCode === 403
              ? "Email provider rejected the request. Please contact support."
              : "Unable to send email. Try again later.",
          );
        }
      },
    },
  },

  emailVerification: {
    async afterEmailVerification(user) {
      const response = await safeSend(() =>
        email.emailVerification.sendEmailVerifiedNotification({
          name: user.name,
          to: user.email,
          newEmail: user.email,
        }),
      );

      if (response.error) {
        console.error("afterEmailVerification failed:", response.error);
        // Non-fatal — don’t throw, since user is already verified
      }
    },

    async sendVerificationEmail({ user, url }) {
      const response = await safeSend(() =>
        email.emailVerification.sendVerificationToEmail({
          name: user.name,
          to: user.email,
          newEmail: user.email,
          verificationUrl: url,
        }),
      );

      if (response.error) {
        console.error("sendVerificationEmail failed:", response.error);
        throw new Error(
          response.error.statusCode === 403
            ? "Email provider rejected the request. Please contact support."
            : "Unable to send verification email. Try again later.",
        );
      }
    },

    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 43_200, // 12 hours
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,

    async onPasswordReset({ user }) {
      const response = await safeSend(() =>
        email.password.passwordChangedAck({
          to: user.email,
          name: user.name,
        }),
      );

      if (response.error) {
        console.error("onPasswordReset failed:", response.error);
        // Non-fatal, user already reset password successfully
      }
    },

    async sendResetPassword({ user, url }) {
      const response = await safeSend(() =>
        email.password.passwordResetRequest({
          to: user.email,
          name: user.name,
          resetUrl: url,
        }),
      );

      if (response.error) {
        console.error("sendResetPassword failed:", response.error);
        throw new Error(
          response.error.statusCode === 403
            ? "Email provider rejected the request. Please contact support."
            : "Unable to send password reset email. Try again later.",
        );
      }
    },
  },

  plugins: [nextCookies()],
});
