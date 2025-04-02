import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";
// 최초 렌더링시에는 createElement로 DOM을 생성하고
// 이후에는 updateElement로 기존 DOM을 업데이트한다.
// 렌더링이 완료되면 container에 이벤트를 등록한다.
/**
 * @param {*} vNode - 렌더링할 가상 노드
 * @param {Element} container - 렌더링할 DOM root element
 */
export function renderElement(vNode, container) {
  // vNode 정규화
  const normalizedVNode = normalizeVNode(vNode);

  if (!container.currentVNode) {
    // 최초 렌더링
    const $elem = createElement(normalizedVNode);
    container.appendChild($elem);
  } else {
    // 이후부터 업데이트
    updateElement(container, normalizedVNode, container.currentVNode);
  }

  // 현재 VNode를 저장 (다음 diff용)
  container.currentVNode = normalizedVNode;

  // 이벤트 위임 등록
  setupEventListeners(container);
}
