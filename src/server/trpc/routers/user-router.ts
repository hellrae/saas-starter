import { createTRPCRouter, authedProcedure } from "../init";
import { changePasswordFormSchema, userSchema } from "@/types/auth-type";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const userRouter = createTRPCRouter({
  updateUser: authedProcedure
    .input(userSchema.pick({ name: true, email: true }).partial())
    .mutation(async ({ input }) => {
      let updated: Record<string, unknown> = {};

      // If name present → call updateUser
      if (input.name) {
        const res = await auth.api.updateUser({
          body: {
            ...(input.name && { name: input.name }),
          },
          headers: await headers(),
        });
        updated = { ...updated, ...(res ?? {}) };
      }

      // If email present → call changeEmail
      if (input.email) {
        const res = await auth.api.changeEmail({
          body: { newEmail: input.email },
          headers: await headers(),
        });
        updated = { ...updated, ...(res ?? {}) };
      }

      return {
        success: true,
        updated,
      };
    }),

  resendEmailVerificationLink: authedProcedure
    .input(userSchema.shape.email)
    .mutation(async ({ input: email }) => {
      return await auth.api.sendVerificationEmail({ body: { email } });
    }),

  changePassword: authedProcedure
    .input(changePasswordFormSchema)
    .mutation(async ({ input: values }) => {
      await auth.api.changePassword({
        body: {
          currentPassword: values.currentPassword,
          newPassword: values.confirmPassword,
        },
        headers: await headers(),
      });

      return { success: true };
    }),
});
