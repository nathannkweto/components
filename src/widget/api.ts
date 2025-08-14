// src/widget/api.ts
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function handleRes(res: Response) {
  const content = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(content?.message || 'Request failed');
  return content;
}

export async function login(payload: { email: string; password: string; }) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  });
  return handleRes(res);
}

export async function register(payload: { name: string; email: string; password: string; }) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  });
  return handleRes(res);
}

export async function logout() {
  const res = await fetch(`${API_BASE}/logout`, {
    method: 'POST',
    credentials: 'include'
  });
  return handleRes(res);
}
