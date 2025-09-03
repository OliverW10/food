import { initTRPC } from '@trpc/server';
import { CreateHTTPContextOptions } from '@trpc/server/dist/adapters/standalone.cjs';
import { verifyAccessToken } from './service/auth';

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */


/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */

export function createContext(opts: CreateHTTPContextOptions) {
    return { req: opts.req, res: opts.res };
}

type Context = ReturnType<typeof createContext>;
const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(({ ctx, next }) => {
    const token = ctx.req.headers.authorization?.split(' ')[1];
    if (!token) {
        throw new Error('Unauthorized');
    }

    try {
        const decoded = verifyAccessToken(token);
        return next({ ctx: { ...ctx, user: decoded } });
    } catch {
        throw new Error('Invlaid token');
    }
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);