import { z } from "zod";

export const errorResponse = z.object({
  statusCode: z.number(),
  error: z.string(),
  message: z.string(),
});

export type ErrorResponse = z.infer<typeof errorResponse>;
