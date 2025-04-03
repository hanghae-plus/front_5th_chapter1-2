import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

const OldNodeMap = new WeakMap();

export function renderElement(vNode, container) {
  if (!container || !container.nodeType) return;
  if (!vNode) {
    container.innerHTML = "";
    return container;
  }

  const newNode = normalizeVNode(vNode);
  if (!newNode) return container;

  const oldNode = OldNodeMap.get(container);

  if (!oldNode) {
    const element = createElement(newNode);
    if (element) {
      container.appendChild(element);
    }
  } else {
    updateElement(container, newNode, oldNode, 0);
  }

  OldNodeMap.set(container, newNode);
  setupEventListeners(container);

  return container;
}