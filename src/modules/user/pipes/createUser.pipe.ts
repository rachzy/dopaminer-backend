import { z } from 'zod';

export const createUserSchema = z
  .object({
    username: z.string().min(3).max(32),
    birthday: z
      .string()
      .refine(
        (str) =>
          new Date(str).getFullYear() > 1900 &&
          new Date(str).getFullYear() < new Date().getFullYear(),
        { message: 'Invalid date (must range from 1900 to 2023).' },
      ),
    profilePicture: z.string().max(64).optional(),
  })
  .required()
  .strict();
