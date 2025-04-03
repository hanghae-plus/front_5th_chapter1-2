import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

let oldNode = null;

export function renderElement(vNode, container) {
  const newNode = normalizeVNode(vNode);

  if (!oldNode) {
    // 최초 렌더링시에는 createElement로 DOM을 생성하고
    const node = createElement(newNode);
    container.appendChild(node);
  } else {
    // 이후에는 updateElement로 기존 DOM을 업데이트한다.
    updateElement(container, newNode, oldNode);
  }

  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  setupEventListeners(container);

  // node 업데이트
  oldNode = newNode;
}
