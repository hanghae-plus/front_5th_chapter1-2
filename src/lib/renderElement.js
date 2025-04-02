import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

let oldNode = null;

export function renderElement(vNode, container) {
  const newNode = normalizeVNode(vNode);

  if (container.innerHTML === "") {
    oldNode = newNode;

    const element = createElement(oldNode);
    container.appendChild(element);
  } else {
    updateElement(container, normalizeVNode(vNode), oldNode);
    oldNode = newNode;
  }

  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  setupEventListeners(container);
}
