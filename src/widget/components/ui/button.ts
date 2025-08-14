import { el } from '../../../utils/dom';

export function Button(text: string, attrs: Record<string,string> = {}) {
  if (!attrs.type) attrs.type = 'button';
  return el('button', attrs, text);
}
