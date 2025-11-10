import { text, timestamp } from "drizzle-orm/pg-core";
import { createTable } from "@/server/db/create-table";

export const newsletter = createTable("newsletter", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});
