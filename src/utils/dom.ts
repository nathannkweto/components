export function el(tag = 'div', attrs: Record<string,string> = {}, ...children: (string | Node)[]) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v]) => node.setAttribute(k, v));
  children.forEach(child => {
    if (typeof child === 'string') node.appendChild(document.createTextNode(child));
    else node.appendChild(child);
  });
  return node;
}
