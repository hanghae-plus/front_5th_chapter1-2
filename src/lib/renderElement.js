import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

let prevNode = null;
export function renderElement(vNode, container) {
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  const normalizedNode = normalizeVNode(vNode);

  if (!prevNode) {
    // 초기 렌더링
    const $el = createElement(normalizedNode);
    container.appendChild($el);
  } else {
    updateElement(container, normalizedNode, prevNode);
  }

  prevNode = normalizedNode;
  setupEventListeners(container);
}
