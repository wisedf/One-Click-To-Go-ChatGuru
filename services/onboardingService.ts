
import { httpClient } from './httpClient';
import { OnboardingData } from '../types';

// Simulando delay para UX
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const onboardingService = {
  async checkEmailExists(email: string) {
    // Simulação: Implementar chamada real via httpClient
    await delay(600);
    // return httpClient.post<{ exists: boolean }>('/auth/check-email', { email });
    return { ok: true, data: { exists: false } }; // Mock
  },

  async sendVerificationCode(email: string) {
    await delay(800);
    return { ok: true };
  },

  async verifyCode(email: string, code: string) {
    await delay(1000);
    if (code === 'ERROR') return { ok: false, message: 'Código inválido' };
    return { ok: true };
  },

  async createAccount(data: OnboardingData) {
    // Payload consolidado (RF-03)
    await delay(1500);
    return { ok: true, data: { sessionId: 'sess_12345', userId: 'user_987' } };
  },

  async getWhatsAppQRCode(sessionId: string) {
    await delay(500);
    return { ok: true, data: { qrCode: 'base64_mock_qr_code', status: 'pending' } };
  },
  
  async checkWhatsAppStatus(sessionId: string) {
    // Long polling simulation
    return { ok: true, data: { connected: true } };
  }
};
