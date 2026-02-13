
import { z } from 'zod';

export const authSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(100),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
  confirmPwd: z.string()
}).refine((data) => data.password === data.confirmPwd, {
  message: "As senhas não coincidem",
  path: ["confirmPwd"],
});

export const verifySchema = z.object({
  companyName: z.string()
    .min(3, "O nome da empresa deve ter mais de 3 caracteres")
    .max(300, "O nome da empresa deve ter no máximo 300 caracteres"),
  phone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Formato inválido. Use (99) 99999-9999"),
  agreed: z.literal(true, {
    errorMap: () => ({ message: "Você deve aceitar os termos para continuar" }),
  }),
});

export const chatbotSchema = z.object({
  greetingMsg: z.string().min(5, "A mensagem deve ter pelo menos 5 caracteres"),
});

export type AuthData = z.infer<typeof authSchema>;
export type VerifyData = z.infer<typeof verifySchema>;
