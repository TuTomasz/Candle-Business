import z from "zod";

export const profileTransport = z.strictObject({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const profileDetailsTransport = z.strictObject({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const profileTransportArray = z.array(profileTransport);

export const profileCreateTransport = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email(),
  password: z.string().min(8).max(255),
});

export type ProfileTransport = z.infer<typeof profileTransport>;
export type ProfileDetailsTransport = z.infer<typeof profileDetailsTransport>;
export type ProfileCreateTransport = z.infer<typeof profileCreateTransport>;
