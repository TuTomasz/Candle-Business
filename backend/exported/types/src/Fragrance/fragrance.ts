import z from "zod";

export const fragranceTransport = z.strictObject({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  image_url: z.string(),
});

export const fragranceCreateTransport = z.object({
  name: z.string().min(3).max(255),
  description: z.string(),
  category: z.string(),
  image_url: z.string(),
});

export type FragranceTransport = z.infer<typeof fragranceTransport>;
export type FragranceCreateTransport = z.infer<typeof fragranceCreateTransport>;
export type FragranceUpdateTransport = z.infer<typeof fragranceCreateTransport>;
