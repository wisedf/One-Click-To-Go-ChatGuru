
import { describe, it, expect } from 'vitest';
import { authSchema, verifySchema } from '../validators/schemas';

describe('Validação de Onboarding (Regras de Negócio)', () => {
  
  describe('Schema de Autenticação (AuthStep)', () => {
    it('deve validar um usuário correto', () => {
      const validUser = {
        name: 'Carlos Silva',
        email: 'carlos@empresa.com',
        password: 'password123',
        confirmPwd: 'password123'
      };
      const result = authSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar senhas que não coincidem', () => {
      const invalidUser = {
        name: 'Carlos Silva',
        email: 'carlos@empresa.com',
        password: 'password123',
        confirmPwd: 'password456'
      };
      const result = authSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("As senhas não coincidem");
      }
    });

    it('deve rejeitar senha curta', () => {
      const invalidUser = {
        name: 'Carlos',
        email: 'carlos@test.com',
        password: '123',
        confirmPwd: '123'
      };
      const result = authSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });
  });

  describe('Schema de Verificação (VerifyStep)', () => {
    it('deve aceitar telefone formatado corretamente', () => {
      const data = {
        companyName: 'Minha Loja',
        phone: '(11) 98765-4321',
        agreed: true
      };
      const result = verifySchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar nome de empresa muito curto', () => {
      const data = {
        companyName: 'ABC',
        phone: '(11) 98765-4321',
        agreed: true
      };
      const result = verifySchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('deve rejeitar se termos não forem aceitos', () => {
      const data = {
        companyName: 'Minha Loja',
        phone: '(11) 98765-4321',
        // agreed missing or false
      };
      const result = verifySchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
