import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
// import { updateElement } from "./updateElement";

/**
 * 최초 렌더링시에는 createElement로 DOM을 생성하고
 * 이후에는 updateElement로 기존 DOM을 업데이트한다.
 * 렌더링이 완료되면 container에 이벤트를 등록한다.
 * @param {*} vNode 렌더링할 노드
 * @param {*} container 렌더링할 컨테이너
 */
export function renderElement(vNode, container) {
  // const isInitialRender = vNode.children.length === 0;

  // if (isInitialRender) {
  const normalizedNode = normalizeVNode(vNode);
  const element = createElement(normalizedNode);

  container.innerHTML = "";

  container.appendChild(element);
  setupEventListeners(container);
  // } else {
  //   updateElement(vNode, container);
  //   setupEventListeners(container);
  // }
}
