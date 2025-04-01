import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
// import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  /**
   *  최초 렌더링시에는 createElement로 DOM을 생성하고
   * 이후에는 updateElement로 기존 DOM을 업데이트한다.
   * 렌더링이 완료되면 container에 이벤트를 등록한다.
   */

  const normalizedVNode = normalizeVNode(vNode);

  // 이전 vNode가 있는지 확인
  // const oldVNode = container._vNode;

  // if (!oldVNode) {
  // 최초 렌더링
  const $el = createElement(normalizedVNode);
  container.appendChild($el);
  setupEventListeners(container);
  // }
  // else {
  //   // 업데이트
  //   updateElement(container, normalizedVNode, oldVNode);
  // }

  // 현재 vNode를 저장
  container._vNode = normalizedVNode;
}
