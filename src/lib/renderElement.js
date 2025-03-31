import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
// import { updateElement } from "./updateElement";

// let initial = true;

export function renderElement(vNode, container) {
  container.innerHTML = "";
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  const element = createElement(normalizeVNode(vNode));
  container.appendChild(element);

  // if (initial) {
  //   initial = false;
  // } else {
  //   // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  //   updateElement(vNode, container);
  // }

  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  setupEventListeners(container);
}
