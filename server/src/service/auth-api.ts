import { z } from 'zod';
import { db } from '../db';
import { publicProcedure, router } from '../trpc';
import { comparePassword, createAccessToken, createRefreshToken, hashPassword, verifyRefreshToken } from './auth';

export const authApi = router({
    login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ input }) => {
        console.log("Attempt to login user:", input.email);
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
            const payload = verifyRefreshToken(input.refreshToken);
            const userId = Number(payload.sub);
            if (isNaN(userId)) {
                throw new Error('Invalid user id in token');
            }
            const user = await db.user.findUnique({ where: { id: userId } });
            if (!user) {
                throw new Error('User not found');
            }

            const newAccessToken = createAccessToken({ id: user.id, email: user.email });

            return {
                accessToken: newAccessToken
            };
        }),
    
    register: publicProcedure
        .input(z.object({
            email: z.email(),
            password: z.string().min(6),
            name: z.string().optional()
        }))
        .mutation(async ({ input }) => {
            console.log("Attempt to register user:", input.email);
            const currentUser = await db.user.findUnique({ where: { email: input.email } });
            if (currentUser) {
                throw new Error('User already exists');
            }

            console.log("hashing password!");
            const passwordHash = await hashPassword(input.password);
            const user = await db.user.create({
                data: {
                    email: input.email,
                    passswordHash: passwordHash,
                    name: input.name,
                }
            });

            console.log("creating tokens!")

            const accessToken = createAccessToken({ id: user.id, email: user.email });
            const refreshToken = createRefreshToken({ id: user.id, email: user.email });

            console.log("returning data!");

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
});