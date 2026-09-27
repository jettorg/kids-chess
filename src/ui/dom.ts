/** 클릭 핸들러가 붙은 버튼 하나 */
export function button(label: string, onClick: () => void, className = ''): HTMLButtonElement {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = className;
  el.textContent = label;
  el.addEventListener('click', onClick);
  return el;
}
