
export interface ApiResult<T> {
  ok: boolean;
  data?: T;
  message?: string;
  code?: string;
}

interface RequestConfig extends RequestInit {
  timeout?: number;
}

// Fix: Property 'env' does not exist on type 'ImportMeta'
const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'https://api.mock.com';

async function http<T>(path: string, config: RequestConfig = {}): Promise<ApiResult<T>> {
  const { timeout = 8000, headers, ...options } = config;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      signal: controller.signal,
    });

    clearTimeout(id);

    if (!response.ok) {
      // Tenta fazer o parse do erro da API, senão usa status text
      const errorBody = await response.json().catch(() => ({}));
      return {
        ok: false,
        message: errorBody.message || `Erro HTTP: ${response.status}`,
        code: errorBody.code || String(response.status),
      };
    }

    const data = await response.json();
    return { ok: true, data };

  } catch (error: any) {
    clearTimeout(id);
    const isAbort = error.name === 'AbortError';
    
    return {
      ok: false,
      message: isAbort ? 'O tempo limite da requisição excedeu.' : 'Falha na conexão. Verifique sua internet.',
      code: isAbort ? 'TIMEOUT' : 'NETWORK_ERROR',
    };
  }
}

export const httpClient = {
  get: <T>(path: string, config?: RequestConfig) => http<T>(path, { ...config, method: 'GET' }),
  post: <T>(path: string, body: any, config?: RequestConfig) => http<T>(path, { ...config, method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: any, config?: RequestConfig) => http<T>(path, { ...config, method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string, config?: RequestConfig) => http<T>(path, { ...config, method: 'DELETE' }),
};
