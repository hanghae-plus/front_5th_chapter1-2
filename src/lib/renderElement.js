import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

/** 
 * basic
 * vNode를 정규화 한 다음에
 * createElement로 노드를 만들고
 * container에 삽입하고
 * 이벤트를 등록합니다.

 * advanced
 * - 최초 렌더링일 때는 createElement 사용
 * - 리렌더링일 때는 updateElement 사용
 */

export function renderElement(vNode, container) {
  const normalizedVNode = normalizeVNode(vNode);
  const oldNode = container._vNode;

  if (!oldNode) {
    // 최초 렌더링일 경우 createElement
    const element = createElement(normalizedVNode);
    container.appendChild(element);
  } else {
    // 업데이트일 경우 updateElement(target, newNode, oldNode)
    updateElement(container, normalizedVNode, oldNode);
  }

  // 이벤트 리스너 설정 (eventManager가 내부적으로 이전 리스너 정리)
  setupEventListeners(container);

  // 최신화
  container._vNode = normalizedVNode;
}
