import { z } from 'zod';
import { db } from '../db';
import { publicProcedure, router } from '../trpc';
import { comparePassword, createAccessToken, createRefreshToken, verifyRefreshToken } from './auth';

export const authApi = router({
    login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ input }) => {
        const user = await db.user.findUnique({ where: { email: input.email } });
        if (!user || !user.passswordHash) {
            throw new Error('Invalid email or password');
        }

        const valid = await comparePassword(input.password, user.passswordHash);
        if (!valid) {
            throw new Error('Invalid email or password');
        }

        const accessToken = createAccessToken({ id: user.id, email: user.email });
        const refreshToken = createRefreshToken({ id: user.id, email: user.email });

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }),

    refresh: publicProcedure
        .input(z.object({ refreshToken: z.string() }))
        .mutation(async ({ input }) => {
            const payload = verifyRefreshToken(input.refreshToken) as any;
            const user = await db.user.findUnique({ where: { id: payload.sub } });
            if (!user) {
                throw new Error('User not found');
            }

            const newAccessToken = createAccessToken({ id: user.id, email: user.email });

            return {
                accessToken: newAccessToken
            };
        }),
});