import { z } from 'zod';

export const formLoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'O e-mail é obrigatório.' })
    .email({ message: 'Por favor, insira um e-mail válido.' }),
  password: z
    .string()
    .min(1, { message: 'A senha é obrigatória.' })
});

export type FormLoginInputs = z.infer<typeof formLoginSchema>;
