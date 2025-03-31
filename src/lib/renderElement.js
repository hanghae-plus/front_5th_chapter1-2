import { createElement } from "./createElement";
import { setupEventListeners } from "./eventManager.js";
import { normalizeVNode } from "./normalizeVNode";
// import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  container.innerHTML = "";

  const element = createElement(normalizeVNode(vNode));
  setupEventListeners(element);
  container.appendChild(element);
  console.log(element);
  return element;
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.
}
