import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(3).max(256),
  difficulty: z.coerce.number().min(1).max(5),
  date: z.string().refine((str) => {
    const date = new Date(str);
    return date.getTime() >= new Date(new Date().getDate()).getTime();
  }),
  duration: z.object({
    value: z.number().min(1).max(60),
    type: z.enum(['minutes', 'hours', 'days', 'weeks', 'months']),
  }),
  activity: z.coerce.number().min(1).max(1),
});
