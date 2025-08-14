import { register as apiRegister } from '../api';
import { createForm } from './ui/form';

// keep same exported function signature: renderRegister(container, onToggle)
export function renderRegister(container: HTMLElement, onToggle: () => void) {
  // helper to extract parentOrigin from URL
  function getParentOriginFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('parentOrigin') || '';
  }
  const parentOrigin = getParentOriginFromUrl() || '';

  const formNode = createForm({
    title: 'Create account',
    fields: [
      { id: 'name', placeholder: 'Full name' },
      { id: 'email', placeholder: 'Email' },
      { id: 'password', type: 'password', placeholder: 'Password' }
    ],
    submitText: 'Register',
    submitInProgressText: 'Registering...',
    submitSuccessText: 'Success',
    toggleText: 'Have an account already?',
    toggleLinkText: 'Login',
    onToggle,
    onSubmit: async (values) => {
      // values: { name, email, password }
      const res = await apiRegister({
        name: values.name,
        email: values.email,
        password: values.password
      });

      // post to parent window (same behavior as before)
      window.parent.postMessage({
        type: 'auth.success',
        token: res.token,
        user: res.user
      }, parentOrigin);

      return res;
    }
  });

  // render into provided container (clear first)
  while (container.firstChild) container.removeChild(container.firstChild);
  container.appendChild(formNode);
}
