import { initTRPC } from '@trpc/server';
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import dotenv from 'dotenv';
import { db } from "./db";
import { publicProcedure, router } from "./trpc";

// Load environment variables from .env.development
dotenv.config({ path: '.env.development' });

const t = initTRPC.create();

const appRouter = router({
  userList: publicProcedure
    .query(async () => {
      console.log("Got request");
      const users = await db.user.findMany();
      return users;
    }),
});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
});
console.log("Started!");
server.listen(3000);