import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

const oldNodes = { node: null };

export function renderElement(vNode, container) {
  const normalizedVNode = normalizeVNode(vNode);
  if (container.childNodes.length) {
    updateElement(container, normalizedVNode, oldNodes["node"]);
    oldNodes.node = normalizedVNode;
  } else {
    const getCreateElement = createElement(normalizedVNode);
    container.appendChild(getCreateElement);
    oldNodes.node = normalizedVNode;
  }
  setupEventListeners(container);
}
