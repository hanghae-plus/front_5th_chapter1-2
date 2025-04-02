import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

/*
 * 가상 DOM 노드를 실제 DOM에 렌더링하는 함수
 * 렌더링할 가상 DOM 노드와 렌더링 할 컨테이너 요소를 인자로 받는다.
 * */
export function renderElement(vNode, container) {
  // vNode를 정규화 (함수형 컴포넌트를 HTML 요소로 변환)
  const normalizedNode = normalizeVNode(vNode);

  // 이전에 렌더링된 노드 확인
  const prevNode = container._prevVNode;

  if (!prevNode) {
    const el = createElement(normalizedNode);

    // 기존 컨텐츠 제거 후 새로운 요소 추가
    container.innerHTML = "";
    container.appendChild(el);
  } else {
    // 변경된 부분 업데이트
    updateElement(container, normalizedNode, prevNode);
  }

  // 이벤트 리스너 설정
  setupEventListeners(container);

  // 현재 노드를 이전 노드로 저장
  container._prevVNode = normalizedNode;
}
