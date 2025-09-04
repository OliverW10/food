import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from 'cors';
import dotenv from 'dotenv';
import { authApi } from "./controllers/auth-api";
import { postApi } from './controllers/post-api';
import { profileApi } from "./controllers/profile-api";
import { db } from "./db";
import { checkMigrations } from "./db-versions";
import { createContext, publicProcedure, router } from "./trpc";

dotenv.config({ path: '.env.development' });

const appRouter = router({
  userList: publicProcedure.query(async () => {
    const users = await db.user.findMany();
    return users;
  }),
  versions: publicProcedure.query(async () => {
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