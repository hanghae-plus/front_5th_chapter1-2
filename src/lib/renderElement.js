import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  const normalizedVNode = normalizeVNode(vNode);

  if (container.oldNode) {
    updateElement(container, normalizedVNode, container.oldNode);
  } else {
    const element = createElement(normalizedVNode);
    container.replaceChildren(element);
  }
  container.oldNode = normalizedVNode;

  setupEventListeners(container);
}
