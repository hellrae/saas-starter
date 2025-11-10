import { createTRPCRouter, publicProcedure } from "../init";
import { newsletterDAL } from "@/server/db/controllers/newsletter-dal";
import { newsletterCreateSchema } from "@/types/newsletter-type";
import { TRPCError } from "@trpc/server";

const dal = new newsletterDAL();

export const newsletterRouter = createTRPCRouter({
  subscribe: publicProcedure
    .input(newsletterCreateSchema)
    .mutation(async ({ input }) => {
      const existing = await dal.findByEmail(input.email);

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This email is already subscribed",
        });
      }

      await dal.create(input);

      return { success: true };
    }),
});
