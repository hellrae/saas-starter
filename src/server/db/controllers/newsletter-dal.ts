import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

import db from "@/server/db";
import { newsletter } from "@/server/db/schema";
import type { NewsletterCreateInput } from "@/types/newsletter-type";

export class newsletterDAL {
  constructor(private readonly database = db) {}

  async create(data: NewsletterCreateInput) {
    const [subscription] = await this.database
      .insert(newsletter)
      .values({
        id: nanoid(),
        email: data.email,
        name: data.name ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return subscription ?? null;
  }

  async findByEmail(email: string) {
    const [subscription] = await this.database
      .select()
      .from(newsletter)
      .where(eq(newsletter.email, email))
      .limit(1);

    return subscription ?? null;
  }
}
