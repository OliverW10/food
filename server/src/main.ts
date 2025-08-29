import { initTRPC } from '@trpc/server';
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from 'cors';
import dotenv from 'dotenv';
import { version } from "../../version";
import { db } from "./db";
import { checkMigrations } from "./db-versions";
import { postApi } from './service/post-api';
import { publicProcedure, router } from "./trpc";
// Load environment variables from .env.development
dotenv.config({ path: '.env.development' });

const t = initTRPC.create();

const appRouter = router({
  userList: publicProcedure.query(async () => {
    console.log("Got request");
    const users = await db.user.findMany();
    return users;
  }),
  versions: publicProcedure.query(async () => {
    console.log("Got versions request");
    const dbVersion = await checkMigrations();
    return {
      dbVersion,
      serverVersion: version
    }
  }),
  post: postApi,
});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext() {
    console.log('context 3');
    return {};
  },
});
const port = 3000;
console.log(`Started server on port ${port}!`);
server.listen(port);