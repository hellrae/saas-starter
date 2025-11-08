import {
  signupFormSchema,
  userSchema,
  resetPasswordFormSchema,
} from "@/types/auth-type";
import { createTRPCRouter, publicProcedure } from "../init";
import { auth } from "@/lib/auth";

export const authRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(signupFormSchema)
    .mutation(async ({ input: values }) => {
      console.log("SignUp values:", values);
      return await auth.api.signUpEmail({
        body: { isDeleted: false, ...values },
      });
    }),

  signIn: publicProcedure
    .input(signupFormSchema.omit({ name: true }))
    .mutation(async ({ input: values }) => {
      return await auth.api.signInEmail({
        body: values,
      });
    }),

  requestPasswordReset: publicProcedure
    .input(userSchema.shape.email)
    .mutation(async ({ input: email }) => {
      await auth.api.requestPasswordReset({
        body: {
          email,
          redirectTo: `/reset-password`,
        },
      });
    }),
  resetPassword: publicProcedure
    .input(resetPasswordFormSchema)
    .mutation(async ({ input: values }) => {
      await auth.api.resetPassword({
        body: {
          newPassword: values.confirmPassword,
          token: values.token,
        },
      });

      return { success: true };
    }),
});
