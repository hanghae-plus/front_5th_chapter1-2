import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

const prevVNodeMap = new Map();

export function renderElement(vNode, container) {
  const normalized = normalizeVNode(vNode);

  const prevVNode = prevVNodeMap.get(container);

  if (!prevVNode) {
    const element = createElement(normalized);

    container.innerHTML = "";
    container.appendChild(element);
  } else {
    updateElement(container, normalized, prevVNode);
  }

  prevVNodeMap.set(container, normalized);
  setupEventListeners(container);
}
