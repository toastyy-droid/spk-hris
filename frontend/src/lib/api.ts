const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const TIMEOUT_MS = 5000;

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function setToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('token', token);
    document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
  } else {
    localStorage.removeItem('token');
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

    const json: ApiResponse<T> = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(((json as unknown as Record<string, unknown>).message as string) || `Request failed with status ${res.status}`);
    }

    return json.data;
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
