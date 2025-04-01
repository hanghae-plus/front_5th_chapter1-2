import { createElement } from "./createElement";
import { setupEventListeners } from "./eventManager";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  const normalizedNode = normalizeVNode(vNode);

  if (!container.oldNode) {
    const element = createElement(normalizedNode);
    container.appendChild(element);
  } else {
    updateElement(container, normalizedNode, container.oldNode);
  }

  //다음 렌더링시 변화 감지를 위해 현재 vNode를 저장
  container.oldNode = normalizedNode;

  setupEventListeners(container);
}
