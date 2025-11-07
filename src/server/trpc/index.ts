import "server-only"; // <-- ensure this file cannot be imported from the client

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cache } from "react";
import { createCallerFactory, createTRPCContext } from "./init";
import { appRouter } from "./routers/_app";
import { makeQueryClient } from "@/lib/trpc/query-client";
import { headers } from "next/headers";

export const getQueryClient = cache(makeQueryClient);
export const caller = createCallerFactory(appRouter)(async () => {
  const req = new Request("http://internal", { headers: await headers() });
  return await createTRPCContext({ req });
});

export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  caller,
  getQueryClient,
);
