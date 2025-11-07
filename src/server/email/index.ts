import { env } from "@/lib/utils/env";
import { Resend } from "resend";
import EmailChangeVerification from "./templates/auth--email-change-verification";
import NewUserEmailVerification from "./templates/auth--new-user-email-verification";
import PasswordChangedAck from "./templates/auth--password-changed-ack";
import PasswordResetRequest from "./templates/auth--password-reset-request";
import { appSeo } from "@/lib/utils/seo";

const resend = new Resend(env.RESEND_API_KEY);
const DEFAULT_EMAIL_ADDRESS = `${appSeo.name} <no-reply@mail.${env.DOMAIN_NAME}>`;

export const email = {
  verification: {
    /**
     * 1️⃣ Send to a new user to verify their email after registration
     * @param to Recipient email address
     * @param name Recipient name
     * @param verificationUrl URL to verify the email
     */
    emailVerification: async ({
      to,
      name,
      verificationUrl,
    }: {
      to: string;
      name: string;
      verificationUrl: string;
    }) => {
      return resend.emails.send({
        from: DEFAULT_EMAIL_ADDRESS,
        to,
        subject: `Welcome to ${appSeo.name}! Please Verify Your Email`,
        react: NewUserEmailVerification({ name, verificationUrl }),
      });
    },

    /**
     * 2️⃣ Send to an existing user who changes their email address
     * @param to Recipient's new email
     * @param name Recipient name
     * @param newEmail New email address
     * @param oldEmail Old email address
     * @param verificationUrl URL to verify the new email
     */
    changeEmailVerification: async ({
      to,
      name,
      newEmail,
      oldEmail,
      verificationUrl,
    }: {
      to: string;
      name: string;
      newEmail: string;
      oldEmail: string;
      verificationUrl: string;
    }) => {
      return resend.emails.send({
        from: DEFAULT_EMAIL_ADDRESS,
        to,
        subject: "Confirm Your New Email Address",
        react: EmailChangeVerification({
          name,
          newEmail,
          oldEmail,
          verificationUrl,
        }),
      });
    },
  },

  password: {
    /**
     * 1️⃣ Send a password reset link when user requests it
     * @param to Recipient email
     * @param name Recipient name
     * @param resetUrl Password reset link
     */
    passwordResetRequest: async ({
      to,
      name,
      resetUrl,
    }: {
      to: string;
      name: string;
      resetUrl: string;
    }) => {
      return resend.emails.send({
        from: DEFAULT_EMAIL_ADDRESS,
        to,
        subject: `Reset Your Password for ${appSeo.name}`,
        react: PasswordResetRequest({ name, resetUrl }),
      });
    },

    /**
     * 2️⃣ Acknowledge password change
     * Send this after a successful password reset or manual change
     * @param to Recipient email
     * @param name Recipient name
     */
    passwordChangedAck: async ({ to, name }: { to: string; name: string }) => {
      return resend.emails.send({
        from: DEFAULT_EMAIL_ADDRESS,
        to,
        subject: "Your Password Has Been Changed",
        react: PasswordChangedAck({ name }),
      });
    },
  },
};
