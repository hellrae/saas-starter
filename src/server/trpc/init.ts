import { type inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { auth } from "@/lib/auth";

export async function createTRPCContext(opts: { req: Request }) {
  const session = await auth.api.getSession({ headers: opts.req.headers });
  return {
    user: session?.user ?? null,
    req: opts.req,
  };
}

type Context = inferAsyncReturnType<typeof createTRPCContext>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
const baseProcedure = t.procedure;

const isAuthedMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      // biome-ignore lint/style/noNonNullAssertion: <for sake>
      user: ctx.user!,
    },
  });
});

export const publicProcedure = baseProcedure;
export const authedProcedure = baseProcedure.use(isAuthedMiddleware);
