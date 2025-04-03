import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";
import { createElement } from "./createElement";
import { setupEventListeners } from "./eventManager";

const oldNodeMap = new Map();

export function renderElement(vNode, container) {
  if (!vNode || !container) return;

  const _oldNode = oldNodeMap.get(container);
  const _normalizedVNode = normalizeVNode(vNode);
  const _dom = createElement(_normalizedVNode);

  if (!_oldNode && !container.innerHTML) {
    container.appendChild(_dom);
  } else {
    updateElement(container, _normalizedVNode, _oldNode);
  }

  oldNodeMap.set(container, _normalizedVNode);
  setupEventListeners(container);
}
