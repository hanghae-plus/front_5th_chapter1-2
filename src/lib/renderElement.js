import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
// import { updateElement } from "./updateElement";

/**
 * @param {VNode} vNode
 * @param {HTMLElement} container
 */
export function renderElement(vNode, container) {
  // 정규화
  const normalizedVNode = normalizeVNode(vNode);

  // 노드 생성
  const element = createElement(normalizedVNode);

  const isFirstRender = container.children.length === 0;

  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  if (isFirstRender) {
    container.appendChild(element);
  }
  // FIXME: 이후에는 updateElement로 기존 DOM을 업데이트한다.
  else {
    container.innerHTML = "";
    container.appendChild(element);
  }

  // 이벤트 등록
  setupEventListeners(container);
}
