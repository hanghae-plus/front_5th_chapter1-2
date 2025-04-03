import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

let prevVNode;

export function renderElement(vNode, container) {
  const nextVNode = normalizeVNode(vNode);

  if (container.innerHTML !== "") {
    updateElement(container, nextVNode, prevVNode);
  } else {
    const $el = createElement(nextVNode);
    container.append($el);
  }
  setupEventListeners(container);
  prevVNode = nextVNode;
}
