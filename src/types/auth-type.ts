import { z } from "zod";

export const userSchema = z.object({
  id: z.string().min(1, "User ID is required"),
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .regex(/^\p{L}+$/u, { message: "Name must contain only letters." }),

  email: z.string().regex(/^[A-Za-z0-9._+\-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, {
    message: "Please enter a valid email address.",
  }),
  emailVerified: z.boolean(),
  image: z
    .string()
    .or(z.literal("").transform(() => undefined))
    .optional(),

  isPhotographer: z.boolean().default(false),
  isDeleted: z.boolean().default(false),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const editableUserProfileSchema = userSchema
  .pick({
    name: true,
    email: true,
  })
  .partial();

export type UserType = z.infer<typeof userSchema>;

export const signupFormSchema = userSchema
  .pick({
    name: true,
    email: true,
  })
  .extend({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number",
      }),
  });

export const signInFormSchema = signupFormSchema.omit({ name: true });

export const newPasswordSchema = z
  .object({
    password: signupFormSchema.shape.password,
    confirmPassword: signupFormSchema.shape.password,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const resetPasswordFormSchema = newPasswordSchema.safeExtend({
  token: z.string(),
});

export const changePasswordFormSchema = newPasswordSchema.safeExtend({
  currentPassword: signupFormSchema.shape.password,
});
