import { z } from "zod";

const passwordValidation = (value: string) => {
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
  return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
};

export const formRegisterSchema = z.object({
  username: z.string().min(2, { message: "Username deve conter pelo menos dois caracteres." }).max(50),
  name: z.string().trim().pipe(z.string().min(3, { message: 'O campo nome deve conter pelo menos 3 caracteres.' })),
  email: z.string().email({ message: 'Insira um e-mail válido.' }),
  password: z.string()
    .min(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
    .refine(passwordValidation, {
      message: 'A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial.',
    }),
  confirmPassword: z.string(),
})
.refine((values) => values.password === values.confirmPassword, {
  message: 'As senhas devem ser iguais!',
  path: ['confirmPassword'],
});

export type formRegisterInputs = z.infer<typeof formRegisterSchema>;