import { env } from "@/lib/utils/env";
import { Resend } from "resend";
import PasswordChangedAck from "./templates/auth--password-changed-ack";
import PasswordResetRequest from "./templates/auth--password-reset-request";
import { appSeo } from "@/lib/utils/seo";
import { EmailChangeApprovalRequest } from "./templates/verification--email-change-approval-request";
import { EmailVerifiedNotification } from "./templates/verification--email-verified-notification";
import EmailVerification from "./templates/verification--email-verification";

const resend = new Resend(env.RESEND_API_KEY);
const DEFAULT_EMAIL_ADDRESS = `${appSeo.name} <no-reply@mail.${env.DOMAIN_NAME}>`;

export const email = {
  emailVerification: {
    /**
     * Step 1 — send approval request to current email
     * @param to current email (where user is already receiving emails)
     * @param name user name
     * @param requestedEmail the new email address user wants to change to
     * @param approvalUrl link to approve the change (one-click)
     */
    requestEmailChangeApproval: async ({
      to,
      name,
      requestedEmail,
      approvalUrl,
    }: {
      to: string;
      name: string;
      requestedEmail: string;
      approvalUrl: string;
    }) => {
      return resend.emails.send({
        from: DEFAULT_EMAIL_ADDRESS,
        to,
        subject: `Approve email change to ${requestedEmail}`,
        react: EmailChangeApprovalRequest({
          name,
          currentEmail: to,
          requestedEmail,
          approvalUrl,
        }),
      });
    },

    /**
     * Step 2 — send verification link to the new email
     * @param to new email
     * @param name user name
     * @param newEmail new email address
     * @param oldEmail previous email address (optional but useful in template)
     * @param verificationUrl link that verifies the new email address
     */
    sendVerificationToEmail: async ({
      to,
      name,
      newEmail,
      verificationUrl,
    }: {
      to: string;
      name: string;
      newEmail: string;
      oldEmail?: string;
      verificationUrl: string;
    }) => {
      return resend.emails.send({
        from: DEFAULT_EMAIL_ADDRESS,
        to,
        subject: `Confirm your new email for ${appSeo.name}`,
        react: EmailVerification({
          email: newEmail,
          name,
          verificationUrl,
        }),
      });
    },

    /**
     * Step 3 — notify new email that verification succeeded
     * @param to new email
     * @param name user name
     * @param newEmail new email address
     * @param profileUrl optional profile/settings url to include
     */
    sendEmailVerifiedNotification: async ({
      to,
      name,
      newEmail,
      profileUrl,
    }: {
      to: string;
      name: string;
      newEmail: string;
      profileUrl?: string;
    }) => {
      return resend.emails.send({
        from: DEFAULT_EMAIL_ADDRESS,
        to,
        subject: `Your email has been verified`,
        react: EmailVerifiedNotification({
          name,
          newEmail,
          profileUrl,
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
