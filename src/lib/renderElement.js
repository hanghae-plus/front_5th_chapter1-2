import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
// import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  const normalized = normalizeVNode(vNode);
  const dom = createElement(normalized);
  container.innerHTML = "";
  container.appendChild(dom);

  setupEventListeners(container);
}
