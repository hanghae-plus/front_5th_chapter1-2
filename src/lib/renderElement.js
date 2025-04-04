import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
// import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  const $element = createElement(normalizeVNode(vNode));
  container.appendChild($element);

  if (container.firstChild) {
    // 이후에는 updateElement로 기존 DOM을 업데이트한다.
    // updateElement(container, normalizeVNode(vNode));
    container.replaceChild($element, container.firstChild);
  }

  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  setupEventListeners(container);
}
