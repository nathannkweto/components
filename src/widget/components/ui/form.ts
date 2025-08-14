import { el } from '../../../utils/dom';
import { Button } from './button';

export type FieldDef = {
  id: string;
  type?: string; // "text" | "password" | "email" ...
  class?: string;
  placeholder?: string;
  name?: string;
  value?: string;
};

export type CreateFormOptions = {
  title: string;
  fields: FieldDef[];
  submitText: string;
  submitInProgressText?: string;
  submitSuccessText?: string;
  toggleText?: string;         // sentence part, e.g. "Have an account already?"
  toggleLinkText?: string;     // link text, e.g. "Login"
  onToggle?: () => void;
  onSubmit: (values: Record<string,string>) => Promise<any>;
};

/**
 * createForm builds and returns a node containing:
 * - title
 * - inputs (based on fields)
 * - submit button
 * - status paragraph
 * - toggle paragraph + link (optional)
 *
 * It handles reading field values, setting status text, and calling onSubmit.
 */
export function createForm(opts: CreateFormOptions): HTMLElement {
  const {
    title,
    fields,
    submitText,
    submitInProgressText = 'Submitting...',
    submitSuccessText = 'Success',
    toggleText,
    toggleLinkText,
    onToggle,
    onSubmit
  } = opts;

  // build input nodes
  const inputNodes = fields.map(f =>
    el('input', {
      id: f.id,
      class: f.class || 'input',
      type: f.type || 'text',
      placeholder: f.placeholder || '',
      name: f.name || f.id,
      value: f.value ?? ''
    })
  );

  // status paragraph
  const statusNode = el('p', { id: 'status' }, '');

  // toggle paragraph (optional)
  const toggleParagraph = (toggleText && toggleLinkText) ? el('p', { style: 'font-size: 0.9em; margin-top: 16px;' },
    toggleText + ' ',
    el('a', {
      href: '#',
      id: 'toggle-link',
      style: 'color: var(--primary-color); cursor: pointer; text-decoration: underline;'
    }, toggleLinkText)
  ) : null;

  // submit button using Button helper
  const submitBtn = Button(submitText, { id: 'submit', class: 'mdc-button' }) as HTMLElement;

  // build the form container
  const nodeChildren: (string | Node)[] = [
    el('h2', {}, title),
    ...inputNodes,
    submitBtn,
    statusNode
  ];
  if (toggleParagraph) nodeChildren.push(toggleParagraph);

  const container = el('div', {}, ...nodeChildren) as HTMLElement;

  // helper to read values
  function readValues(): Record<string,string> {
    const values: Record<string,string> = {};
    for (const f of fields) {
      const input = container.querySelector<HTMLInputElement>(`#${f.id}`);
      values[f.id] = input ? input.value : '';
    }
    return values;
  }

  // wire submit
  submitBtn.addEventListener('click', async () => {
    // clear previous status
    statusNode.textContent = submitInProgressText;
    try {
      const values = readValues();
      const res = await onSubmit(values);
      statusNode.textContent = submitSuccessText;
      return res;
    } catch (err: any) {
      statusNode.textContent = err?.message || 'Submission failed';
      throw err;
    }
  });

  // wire toggle link
  if (toggleParagraph) {
    const toggleLink = container.querySelector<HTMLAnchorElement>('#toggle-link');
    if (toggleLink && onToggle) {
      toggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        onToggle();
      });
    }
  }

  return container;
}
