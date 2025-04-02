import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

const oldNodeMap = new WeakMap();

export function renderElement(vNode, container) {
  const oldNode = oldNodeMap.get(container);
  const newNode = normalizeVNode(vNode);

  if (!oldNode) {
    container.appendChild(createElement(newNode));
  } else {
    updateElement(container, newNode, oldNode);
  }

  oldNodeMap.set(container, newNode);
  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  setupEventListeners(container);
}
