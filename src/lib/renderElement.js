import { setupEventListeners, cleanupEvents } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

/**
 * 가상 DOM을 실제 DOM으로 렌더링하는 함수 - 현재 렌더링된 DOM(?)
 * @param {*} newVirtualDOM - 새로운 가상 DOM
 * @param {*} container - 실제 DOM 컨테이너
 */
export function renderElement(newVirtualDOM, container) {
  // 0. 기존에 등록된 이벤트 리스너들을 정리
  cleanupEvents(container);

  // 1. 새로운 가상 DOM을 정규화 (일관된 형태로 변환)
  const normalizedNewVirtualDOM = normalizeVNode(newVirtualDOM);

  // 2. 최초 렌더링인지 확인
  const isFirstRendering = !container._previousVirtualDOM;

  if (isFirstRendering) {
    // 최초 렌더링: 새로운 DOM 요소 생성 후 추가
    const newDOMElement = createElement(normalizedNewVirtualDOM);
    // if (newDOMElement instanceof Node) {
    container.appendChild(newDOMElement);
    // }
  } else {
    // 재렌더링: 이전 가상 DOM과 비교하여 변경된 부분만 업데이트
    updateElement(
      container, // 실제 DOM 컨테이너
      normalizedNewVirtualDOM, // 새로운 가상 DOM
      container._previousVirtualDOM, // 이전 가상 DOM
      0, // 시작 인덱스
    );
  }

  // 3. 다음 비교를 위해 현재의 가상 DOM 저장 - 메모리에 할당
  container._previousVirtualDOM = normalizedNewVirtualDOM;

  // 4. 새로운 이벤트 리스너 설정
  setupEventListeners(container);
}
