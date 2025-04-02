import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  // 1. vNode를 정규화
  const _normalizeVNode = normalizeVNode(vNode);

  // 2. container의 첫번째 자식 요소 확인
  const oldElement = container.firstElementChild;

  // 3. 최초 렌더링시에는 createElement로 DOM을 생성
  if (!oldElement) {
    const element = createElement(_normalizeVNode);

    // 요소에 현재 vNode 정보 저장 (나중에 비교를 위해)
    element.__vNode = _normalizeVNode;

    // container에 요소 추가
    container.appendChild(element);
  } else {
    // updateElement로 기존 DOM을 업데이트
    const updatedElement = updateElement(
      container, // 부모 요소
      _normalizeVNode, // 새로운 노드
      oldElement.__vNode, // 이전 노드 (container의 첫 번째 자식의 이전 가상 노드)
      0, // 첫 번째 자식 요소이므로 index는 0
    );

    if (updatedElement) {
      // 업데이트된 요소에 새 vNode 정보 저장
      updatedElement.__vNode = _normalizeVNode;
    }
  }
  // 4. container에 이벤트를 등록
  setupEventListeners(container);
}
