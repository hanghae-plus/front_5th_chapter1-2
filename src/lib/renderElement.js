import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

//기본과제 통과 코드
// export function renderElement(vNode, container) {
//   container.innerHTML = "";
//   clearEventMap(container);
//   const normalizedNode = normalizeVNode(vNode);
//   const element = createElement(normalizedNode);
//   container.appendChild(element);
//   setupEventListeners(container);
// }
const vNodeHistory = new WeakMap();

export function renderElement(vNode, container) {
  const prevVNode = vNodeHistory.get(container);
  const nextVNode = normalizeVNode(vNode);

  if (!prevVNode) {
    const element = createElement(nextVNode);
    container.appendChild(element);
  } else {
    updateElement(container, nextVNode, prevVNode);
  }

  vNodeHistory.set(container, nextVNode);
  setupEventListeners(container);
}
