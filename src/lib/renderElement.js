import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  const normalizedVNode = normalizeVNode(vNode);

  if (container.oldNode !== undefined) {
    updateElement(container, normalizedVNode, container.oldNode);
  } else {
    const $el = createElement(normalizedVNode);
    container.appendChild($el);
  }

  setupEventListeners(container);

  container.oldNode = normalizedVNode;
}
