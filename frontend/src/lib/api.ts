const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const TIMEOUT_MS = 45000;
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('token');
  const expiresAt = Number(localStorage.getItem('tokenExpiresAt'));

  if (!token) return null;
  if (!expiresAt || Date.now() >= expiresAt) {
    setToken(null);
    return null;
  }

  return token;
}

export function setToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpiresAt', String(Date.now() + SESSION_DURATION_MS));
    document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiresAt');
    document.cookie = 'token=; path=/; max-age=0';
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    if (res.status === 401) {
      setToken(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Sesi telah berakhir, silakan login ulang');
    }

    const json: ApiResponse<T> = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(((json as unknown as Record<string, unknown>).message as string) || `Request failed with status ${res.status}`);
    }

    return json.data;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Request terlalu lama. Pastikan backend berjalan, lalu coba lagi.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
