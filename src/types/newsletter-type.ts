import { z } from "zod";

export const newsletterSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type NewsletterType = z.infer<typeof newsletterSchema>;

export const newsletterCreateSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

export type NewsletterCreateInput = z.infer<typeof newsletterCreateSchema>;
