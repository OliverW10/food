import { z } from "zod";

export const idSchema = z.number().int().positive();

export const idInputSchema = z.object({ id: idSchema });
export type IdInput = z.infer<typeof idInputSchema>;