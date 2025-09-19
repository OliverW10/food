import { db } from "../db";

export interface SaveImageOptions {
  file: Express.Multer.File;
  prefixGuid?: string; // supply a pre-generated guid if needed
}

export interface SavedImage {
  id: number;
  storageUrl: string;
}

/**
 * Persists image metadata after multer stores it on disk.
 * Generates a stable storageUrl that can later be attached to a Post.
 */
export async function saveUploadedImage(
  opts: SaveImageOptions
): Promise<SavedImage> {
  const { file } = opts;
  if (!file) {
    throw new Error("File is required");
  }
  const storageUrl = `/uploads/${file.filename}`;
  const image = await db.image.create({
    data: { storageUrl },
  });
  return { id: image.id, storageUrl: image.storageUrl };
}
