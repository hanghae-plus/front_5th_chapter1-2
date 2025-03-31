import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.

  // 정규화
  const normalizedNode = normalizeVNode(vNode);

  if (container.childNodes.length > 0) {
    // 업데이트
    updateElement(container, normalizedNode, container._vNode || null);
  } else {
    // 최초 렌더링
    const element = createElement(normalizedNode);
    container.appendChild(element);
  }

  // 현재 vNode를 container에 저장 (다음 업데이트 고려)
  container._vNode = normalizedNode;

  // 이벤트 리스너 설정
  setupEventListeners(container);

  return container;
}
