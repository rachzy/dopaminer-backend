import { z } from 'zod';

export const createAccountSchema = z
  .object({
    email: z.string().min(10).max(128).email(),
    password: z.string().min(5).max(255),
  })
  .required()
  .strict();
