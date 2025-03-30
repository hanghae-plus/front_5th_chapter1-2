import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  const normalizedNode = normalizeVNode(vNode);
  if (container._vNode) {
    updateElement(container, normalizedNode, container._vNode);
  } else {
    const element = createElement(normalizedNode);
    container.appendChild(element);
  }

  /** vNode를 저장하여 다음 렌더링 시 비교: oldNode의 역할을 함 */
  container._vNode = normalizedNode;

  setupEventListeners(container);
}
