import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

/**
 * 가상 DOM을 실제 DOM으로 렌더링합니다.
 * 최초 렌더링시에는 createElement로 DOM을 생성하고
 * 이후에는 updateElement로 기존 DOM을 업데이트합니다.
 * 렌더링이 완료되면 container에 이벤트를 등록합니다.
 *
 * @param {Object} vNode - 가상 DOM 노드
 * @param {HTMLElement} container - 렌더링 대상 컨테이너
 * @returns {HTMLElement} 렌더링된 컨테이너
 */
const OldNodeMap = new WeakMap();

export function renderElement(vNode, container) {
  // 1. vNode 정규화
  const normalizedNode = normalizeVNode(vNode);

  // 2. 이전에 렌더링된 노드 가져오기
  const oldNode = OldNodeMap.get(container);

  // 3. 렌더링 수행
  if (!oldNode) {
    // 최초 렌더링: createElement로 DOM 생성
    const domElement = createElement(normalizedNode);
    container.innerHTML = ""; // 컨테이너 비우기
    container.appendChild(domElement);
  } else {
    // 재렌더링: updateElement로 DOM 업데이트
    updateElement(container, normalizedNode, oldNode, 0);
  }

  // 4. 현재 노드를 맵에 저장 (다음 렌더링에 사용)
  OldNodeMap.set(container, normalizedNode);

  // 5. 이벤트 리스너 설정 (이벤트 위임)
  setupEventListeners(container);

  // 렌더링된 컨테이너 반환
  return container;
}
