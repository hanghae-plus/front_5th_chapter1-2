import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

//이전 DOM 저장
let oldNode = null;

export function renderElement(vNode, container) {
  //Node 정규화
  const newNode = normalizeVNode(vNode);

  //최초 렌더링 여부
  if (!container.hasChildNodes()) {
    oldNode = newNode;
    const element = createElement(newNode);
    container.appendChild(element);
  } else {
    updateElement(container, normalizeVNode(vNode), oldNode);
    oldNode = newNode;
  }
  setupEventListeners(container);
}
