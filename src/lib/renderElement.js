import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  const normalizedNode = normalizeVNode(vNode);

  if (container.childNodes.length > 0) {
    updateElement(container, normalizedNode, container._vNode || null);
  } else {
    const element = createElement(normalizedNode);
    container.appendChild(element);
  }

  container._vNode = normalizedNode;

  // 이벤트 리스너 설정
  setupEventListeners(container);

  return container;
}
