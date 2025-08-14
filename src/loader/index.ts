// src/loader/index.ts
type Mode = 'login' | 'register';

interface InitOptions {
  containerId?: string;            // id of an existing element to attach to
  el?: HTMLElement;                // alternatively pass element directly
  widgetUrl?: string;              // full url to your widget (hosted on your domain)
  primaryColor?: string;
  fontFamily?: string;
  mode?: Mode;
  height?: string;                 // iframe height (e.g. '540px' or '100%')
  allowAutoResize?: boolean;       // whether to listen to resize messages
}

declare global {
  interface Window { AuthWidget?: any; }
}

(function (global) {
  const DEFAULTS: Required<InitOptions> = {
    containerId: 'auth-widget',
    el: null as any,
    widgetUrl: import.meta.env.VITE_WIDGET_BASE_URL ? import.meta.env.VITE_WIDGET_BASE_URL + '/index.html' : 'http://localhost/widget/index.html',
    primaryColor: '#FF6633',
    fontFamily: 'Arial, sans-serif',
    mode: 'login',
    height: '560px',
    allowAutoResize: true
  };

  function createIframe(src: string, height: string) {
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.style.width = '100%';
    iframe.style.height = height;
    iframe.style.border = '0';
    iframe.setAttribute('loading', 'lazy');

    // security: sandbox — allow forms, scripts, same-origin if you host on same origin.
    // If using postMessage you may want "allow-scripts allow-same-origin" — be careful.
    iframe.setAttribute('sandbox', 'allow-scripts allow-forms allow-same-origin');
    iframe.setAttribute('referrerpolicy', 'no-referrer');

    return iframe;
  }

  function serializeParams(params: Record<string, string>) {
    const u = new URLSearchParams();
    for (const k in params) {
      u.set(k, params[k]);
    }
    return u.toString();
  }

  function listenForMessages(iframe: HTMLIFrameElement, onEvent: (data: any) => void) {
    function handler(e: MessageEvent) {
      // IMPORTANT: validate origin
      // Replace '*' with the exact origin if you know it (e.g., 'https://auth.yourdomain.com')
      // if (e.origin !== new URL(iframe.src).origin) return;
      if (!e.data || typeof e.data !== 'object') return;
      onEvent(e.data);
    }
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }

  function init(options: InitOptions = {}) {
    const opts = { ...DEFAULTS, ...options };

    let container: HTMLElement | null = opts.el || document.getElementById(opts.containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = opts.containerId;
      document.body.appendChild(container);
    }

    // Allow clients to set config via data-attributes on the container element
    const dataPrimary = container.getAttribute('data-primary-color');
    const dataFont = container.getAttribute('data-font-family');
    const dataMode = container.getAttribute('data-mode');
    if (dataPrimary) opts.primaryColor = dataPrimary;
    if (dataFont) opts.fontFamily = dataFont;
    if (dataMode === 'register' || dataMode === 'login') opts.mode = dataMode as Mode;

    const parentOrigin = window.location.origin;

    const params = {
      primaryColor: opts.primaryColor,
      fontFamily: opts.fontFamily,
      mode: opts.mode,
      parentOrigin,
    };
    const src = opts.widgetUrl + '?' + serializeParams(params);
    const iframe = createIframe(src, opts.height);

    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.minHeight = '100vh';

    container.appendChild(iframe);

    const off = listenForMessages(iframe, (msg) => {
      // messages from the widget might look like:
      // { type: 'auth.success', token: '...', user: {...} }
      if (msg?.type === 'auth.success') {
        // dispatch a DOM event on the container for client apps
        container!.dispatchEvent(new CustomEvent('auth.success', { detail: msg }));
      } else if (msg?.type === 'auth.logout') {
        container!.dispatchEvent(new CustomEvent('auth.logout', { detail: msg }));
      } else if (msg?.type === 'widget.resize' && opts.allowAutoResize) {
        // allow the iframe to tell us to resize
        if (msg.height) iframe.style.height = String(msg.height);
      }
    });

    return {
      iframe,
      destroy() {
        off();
        iframe.remove();
      }
    };
  }

  // expose global
  global.AuthWidget = {
    init,
  };

})(window);

export { };