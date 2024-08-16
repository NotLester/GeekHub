import { z } from 'zod';

const requiredString = z.string().trim().min(1, { message: "Required" });

export const signUpSchema = z.object({
  email: requiredString.email({ message: "Invalid email address" }),
  username: requiredString.regex(/^[a-zA-Z0-9_-]+$/, {
    message: "Only letters, numbers, - and _ allowed",
  }),
  password: requiredString.min(8, { message: "Must be atleast 8 characters" }),
});

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export const createPostSchema = z.object({
  content: requiredString,
  mediaIds: z
    .array(z.string())
    .max(5, { message: "Cannot have more than 5 attachments" }),
});

export const updateUserProfileSchema = z.object({
  displayName: requiredString,
  bio: z.string().max(1000, { message: "Must be at most 1000 characters" }),
});

export type SignUpValues = z.infer<typeof signUpSchema>;
export type LoginValues = z.infer<typeof loginSchema>;
export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;
