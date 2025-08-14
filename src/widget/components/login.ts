import { login as apiLogin } from '../api';
import { createForm } from './ui/form';

export function renderLogin(container: HTMLElement, onToggle: () => void) {
  function getParentOriginFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('parentOrigin') || '';
  }
  const parentOrigin = getParentOriginFromUrl() || '';

  const formNode = createForm({
    title: 'Sign in',
    fields: [
      { id: 'email', placeholder: 'Email' },
      { id: 'password', type: 'password', placeholder: 'Password' }
    ],
    submitText: 'Sign In',
    submitInProgressText: 'Signing in...',
    submitSuccessText: 'Success',
    toggleText: 'Have no account?',
    toggleLinkText: 'Create account',
    onToggle,
    onSubmit: async (values) => {
      const res = await apiLogin({
        email: values.email,
        password: values.password
      });

      window.parent.postMessage({
        type: 'auth.success',
        token: res.token,
        user: res.user
      }, parentOrigin);

      return res;
    }
  });

  while (container.firstChild) container.removeChild(container.firstChild);
  container.appendChild(formNode);
}
