import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  const normalizedVNode = normalizeVNode(vNode);

  const oldVNode = container._vnode;

  if (!oldVNode) {
    const $el = createElement(normalizedVNode);

    container.appendChild($el);

    if (!container._isInitialized) {
      setupEventListeners(container);
      container._isInitialized = true;
    }

    container._vnode = {
      ...normalizedVNode,
      el: $el,
    };
  } else {
    updateElement(container, normalizedVNode, oldVNode);
    setupEventListeners(container);

    container._vnode = {
      ...normalizedVNode,
      el: oldVNode.el,
    };
  }
}
