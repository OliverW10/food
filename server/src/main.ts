// This file was created by Oliver/Mukund on setup and was worked on by a few people
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import crypto from "crypto";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { mkdirSync } from "fs";
import multer from "multer";
import path from "path";
import { authApi } from "./controllers/auth-api";
import { chatApi } from "./controllers/chat-api";
import { commentsApi } from "./controllers/comments-api";
import { postApi } from "./controllers/post-api";
import { profileApi } from "./controllers/profile-api";
import { searchApi } from "./controllers/search-api";
import { db } from "./db";
import { checkMigrations } from "./db-versions";
import { saveUploadedImage } from "./service/upload-service";
import { createContext, publicProcedure, router } from "./trpc";

dotenv.config({ path: ".env.development" });

const appRouter = router({
  userList: publicProcedure.query(async () => {
    const users = await db.user.findMany();
    return users;
  }),
  versions: publicProcedure.query(async () => {
    const dbVersion = await checkMigrations();
    return {
      ...dbVersion,
      serverVersion: 0.1,
    };
  }),
  post: postApi,
  profile: profileApi,
  auth: authApi,
  comments: commentsApi,
  search: searchApi,
  chat: chatApi,
});

export type AppRouter = typeof appRouter;

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
const uploadsDir =
  process.env.UPLOADS_PATH ?? path.join(process.cwd(), "uploads");
mkdirSync(uploadsDir, { recursive: true });
app.use("/uploads", express.static(uploadsDir));

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({ router: appRouter, createContext })
);

const storage = multer.diskStorage({
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => cb(null, uploadsDir),
  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const ext = path.extname(file.originalname);
    const base = crypto.randomBytes(16).toString("hex");
    cb(null, `${base}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 5MB
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image uploads are allowed"));
    }
    cb(null, true);
  },
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.get("/health", (_req: Request, res: Response) =>
  res.json({ status: "ok" })
);

app.post(
  "/api/upload",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const saved = await saveUploadedImage({ file: req.file });
      res.status(201).json(saved);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      console.error("Upload error", err);
      res.status(500).json({ error: message });
    }
  }
);

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
app.listen(port, () => {
  console.log(`Server (REST + tRPC) listening on port ${port}`);
});
