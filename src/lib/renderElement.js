import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

// 최초 렌더링시에는 createElement로 DOM을 생성하고
// 이후에는 updateElement로 기존 DOM을 업데이트한다.
// 렌더링이 완료되면 container에 이벤트를 등록한다.
/**
 * 가상 DOM을 실제 DOM으로 렌더링
 * @param {*} vNode 가상 노드
 * @param {*} container 컨테이너
 * @returns 렌더링된 요소
 */
export function renderElement(vNode, container) {
  const $container = container;

  // 함수형 컴포넌트 정규화
  const normalizedVNode = normalizeVNode(vNode);

  // 기존 DOM이 있는지 확인
  if ($container.firstChild) {
    // DOM 업데이트 (가상 DOM 비교 알고리즘)
    updateElement($container, normalizedVNode, $container._vNode);
  } else {
    // 처음 렌더링 - 새 요소 생성
    const $element = createElement(normalizedVNode);
    $container.appendChild($element);
  }

  // 현재 vNode 저장 (다음 렌더링 시 비교용)
  $container._vNode = normalizedVNode;

  // 컨테이너에 이벤트 리스너 설정 (한 번만)
  if (!$container._hasEventListeners) {
    setupEventListeners($container);
    $container._hasEventListeners = true;
  }
}
