// src/widget/components/login.ts
import { login as apiLogin } from '../api';

export function renderLogin(container: HTMLElement, onToggle: () => void) {
  container.innerHTML = `
    <h2>Sign in</h2>
    <input class="input" id="email" placeholder="Email" />
    <input class="input" id="password" type="password" placeholder="Password" />
    <button id="submit" class="mdc-button">Sign In</button>
    <p id="status"></p>
    <p style="font-size: 0.9em; margin-top: 16px;">
      Have no account? 
      <a href="#" id="toggle-link" style="color: var(--primary-color); cursor: pointer; text-decoration: underline;">
        Create account
      </a>
    </p>
  `;

  const email = container.querySelector<HTMLInputElement>('#email')!;
  const password = container.querySelector<HTMLInputElement>('#password')!;
  const btn = container.querySelector<HTMLButtonElement>('#submit')!;
  const status = container.querySelector<HTMLParagraphElement>('#status')!;
  const toggleLink = container.querySelector<HTMLAnchorElement>('#toggle-link')!;
  
  function getParentOriginFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('parentOrigin') || '';
}
  const parentOrigin = getParentOriginFromUrl() || '';

  btn.addEventListener('click', async () => {
    status.textContent = 'Signing in...';
    try {
      const res = await apiLogin({ email: email.value, password: password.value });
      status.textContent = 'Success';

      const payload = {
        type: 'auth.success',
        token: res.token,
        user: res.user
      };

      window.parent.postMessage(payload, parentOrigin);
    } catch (err: any) {
      status.textContent = err?.message || 'Login failed';
    }
  });

  toggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    onToggle();
  });
}
