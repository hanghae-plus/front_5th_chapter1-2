import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

/**
 *
 * @param {*} vNode - 렌더링할 요소
 * @param {*} container - 렌더링할 컨테이너
 * @returns
 */

// 최초 렌더링시에는 createElement로 DOM을 생성하고
// 이후에는 updateElement로 기존 DOM을 업데이트한다.
// 렌더링이 완료되면 container에 이벤트를 등록한다.
export function renderElement(vNode, container) {
  const normalizedVNode = normalizeVNode(vNode);
  // 최초 렌더링: container에 아무런 자식이 없으면 새롭게 생성
  if (!container.firstChild) {
    const newDom = createElement(normalizedVNode);
    container.appendChild(newDom);
  } else {
    // 기존 DOM이 있을 경우 diffing을 수행하여 업데이트
    const currentTree = container.children;
    const newTree = createElement(normalizedVNode);
    updateElement(container, newTree, currentTree);
  }
  setupEventListeners(container);
}
