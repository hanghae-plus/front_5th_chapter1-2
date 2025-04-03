import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

const previousVNodeMap = new Map();

export function renderElement(vNode, container) {
  const createdVNode = normalizeVNode(vNode);

  if (container.hasChildNodes()) {
    const previousVNode = previousVNodeMap.get(container);
    previousVNodeMap.set(container, createdVNode);

    updateElement(container, createdVNode, previousVNode);
  } else {
    const element = createElement(createdVNode);
    container.appendChild(element);
    previousVNodeMap.set(container, createdVNode);
  }
  setupEventListeners(container);
}
