import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
// import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  const normalizedVNode = normalizeVNode(vNode);
  const getCreateElement = createElement(normalizedVNode);
  container.appendChild(getCreateElement);
  setupEventListeners(container);
}
