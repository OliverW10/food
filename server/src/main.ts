import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from "./db";
import { checkMigrations } from "./db-versions";
import { authApi } from "./service/auth-api";
import { postApi } from './service/post-api';
import { profileApi } from "./service/profile-api";
import { createContext, publicProcedure, router } from "./trpc";

dotenv.config({ path: '.env.development' });

const appRouter = router({
  userList: publicProcedure.query(async () => {
    const users = await db.user.findMany();
    return users;
  }),
  versions: publicProcedure.query(async () => {
    console.log("Got versions request");
    const dbVersion = await checkMigrations();
    return {
      ...dbVersion,
      serverVersion: 0.1
    }
  }),
  post: postApi,
  profile: profileApi,
  auth: authApi,
});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  middleware: cors(),
  createContext,
  router: appRouter
});

const port = 3000;
console.log(`Started server on port ${port}!`);
server.listen(port);