import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  const isEmptyContainer = container.children.length === 0;
  const normalizedNode = normalizeVNode(vNode);

  if (isEmptyContainer) {
    const element = createElement(normalizedNode);

    container.appendChild(element);
  } else {
    const oldNode = container.children[0];

    updateElement(container, normalizedNode, oldNode);
  }

  setupEventListeners(container);
}
