import { createElement } from "./createElement";
import { setupEventListeners } from "./eventManager";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

let oldNode = null;

export function renderElement(vNode, container) {
  const initElement = container.firstChild;
  const newNode = normalizeVNode(vNode);

  if (!initElement) {
    const node = createElement(newNode);
    container.appendChild(node);
  } else {
    updateElement(container, newNode, oldNode);
  }
  oldNode = newNode;
  setupEventListeners(container);
}
