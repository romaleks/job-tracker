import { z } from 'zod'

export const RegisterUserSchema = z.object({
  body: z.object({
    username: z.string().min(5, 'Username must be at least 5 characters'),
    email: z.string().min(1, 'Email is required'),
    password: z.string().min(6, 'Username must be at least 6 characters'),
  }),
})

export const LoginUserSchema = z.object({
  body: z.object({
    email: z.string().min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required'),
  }),
})

export type RegisterUserInput = z.infer<typeof RegisterUserSchema>['body']
export type LoginUserInput = z.infer<typeof LoginUserSchema>['body']
