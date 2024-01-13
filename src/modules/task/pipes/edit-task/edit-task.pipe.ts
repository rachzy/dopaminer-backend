import { z } from 'zod';

// Function that check if the first date comes before the second one
const isBefore = (date1: Date, date2: Date) => {
  return date1.getTime() <= date2.getTime();
};

export const editTaskSchema = z
  .object({
    title: z.string().min(3).max(256),
    difficulty: z.coerce.number().min(1).max(5),
    date: z.string().refine((str) => {
      const date = new Date(str);
      return isBefore(date, new Date());
    }, 'Invalid creation date'),
    duration: z.object({
      value: z.number().min(1).max(60),
      type: z.enum(['minutes', 'hours', 'days', 'weeks', 'months']),
    }),
    activity: z.coerce.number().min(1).max(1),
    completed: z.boolean(),
    dateOfCompletion: z
      .string()
      .nullable()
      .refine((str) => {
        const date = new Date(str);

        return isBefore(date, new Date());
      }, 'Invalid date of completion'),
  })
  .refine(
    (data) => isBefore(new Date(data.date), new Date(data.dateOfCompletion)),
    'Date of creation is older than completion',
  );
