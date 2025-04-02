import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

const oldNodeMap = new WeakMap();

export function renderElement(vNode, container) {
  const oldNode = oldNodeMap.get(container);
  const newNode = normalizeVNode(vNode);

  if (oldNode) {
    updateElement(container, newNode, oldNode);
  } else {
    container.appendChild(createElement(newNode));
  }

  oldNodeMap.set(container, newNode);
  setupEventListeners(container);
}
