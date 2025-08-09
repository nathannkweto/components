// src/widget/components/register.ts
import { register as apiRegister } from '../api';

export function renderRegister(container: HTMLElement, onToggle: () => void) {
  container.innerHTML = `
    <h2>Create account</h2>
    <input class="input" id="name" placeholder="Full name" />
    <input class="input" id="email" placeholder="Email" />
    <input class="input" id="password" type="password" placeholder="Password" />
    <button id="submit" class="mdc-button">Register</button>
    <p id="status"></p>
    <p style="font-size: 0.9em; margin-top: 16px;">
      Have an account already? 
      <a href="#" id="toggle-link" style="color: var(--primary-color); cursor: pointer; text-decoration: underline;">
        Login
      </a>
    </p>
  `;

  const name = container.querySelector<HTMLInputElement>('#name')!;
  const email = container.querySelector<HTMLInputElement>('#email')!;
  const password = container.querySelector<HTMLInputElement>('#password')!;
  const btn = container.querySelector<HTMLButtonElement>('#submit')!;
  const status = container.querySelector<HTMLParagraphElement>('#status')!;
  const toggleLink = container.querySelector<HTMLAnchorElement>('#toggle-link')!;

  btn.addEventListener('click', async () => {
    status.textContent = 'Registering...';
    try {
      const res = await apiRegister({ name: name.value, email: email.value, password: password.value });
      status.textContent = 'Success';

      window.parent.postMessage({
        type: 'auth.success',
        token: res.token,
        user: res.user
      }, '*');
    } catch (err: any) {
      status.textContent = err?.message || 'Registration failed';
    }
  });

  toggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    onToggle();
  });
}
