// src/widget/main.ts
import { renderLogin } from './components/login';
import { renderRegister } from './components/register';

const params = new URLSearchParams(window.location.search);
const primaryColor = params.get('primaryColor');
const fontFamily = params.get('fontFamily');

if (primaryColor) {
  document.documentElement.style.setProperty('--primary-color', primaryColor);
}
if (fontFamily) {
  document.documentElement.style.setProperty('--font-family', fontFamily);
}

const mount = document.getElementById('forms')!;

let mode = (params.get('mode') || 'login') as 'login' | 'register';

function clearMount(node: HTMLElement) {
  // remove all children without using innerHTML
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function render() {
  clearMount(mount);

  if (mode === 'login') {
    renderLogin(
      mount,
      () => {
        mode = 'register';
        render();
      }
    );
  } else {
    renderRegister(
      mount,
      () => {
        mode = 'login';
        render();
      }
    );
  }
}

render();
