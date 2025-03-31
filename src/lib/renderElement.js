import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  const normalizedVNode = normalizeVNode(vNode);
  const oldVNode = container._vNode || null;

  if (!oldVNode) {
    const newDom = createElement(normalizedVNode);
    container.appendChild(newDom);
  } else {
    updateElement(container, normalizedVNode, oldVNode, 0);
  }

  container._vNode = normalizedVNode;

  if (!container._hasEventListeners) {
    setupEventListeners(container);
    container._hasEventListeners = true;
  }

  return container;
}
