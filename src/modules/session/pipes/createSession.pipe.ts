import { z } from 'zod';

export const createSessionPipe = z.object({
  email: z.string().max(128),
  password: z.string().max(255),
});
