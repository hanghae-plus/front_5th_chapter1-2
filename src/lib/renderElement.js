import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

// 이전 가상 노드를 저장할 WeakMap
const previousNodeMap = new WeakMap();

export function renderElement(vNode, container) {
  // 1. vNode를 정규화
  const newNode = normalizeVNode(vNode);

  // 2. container의 첫번째 자식 요소 확인
  // const oldElement = container.firstElementChild;
  const oldElement = previousNodeMap.get(container);

  // 3. 최초 렌더링 또는 이전 노드가 없는 경우
  if (!oldElement) {
    const element = createElement(newNode);
    container.appendChild(element);
  } else {
    updateElement(
      container, // 부모 요소
      newNode, // 새로운 노드
      oldElement, // 이전 노드 (container의 첫 번째 자식의 이전 가상 노드)
    );
  }
  // 4. 현재 가상 노드를 previousNodeMap에 저장
  previousNodeMap.set(container, newNode);
  // 5. container에 이벤트를 등록
  setupEventListeners(container);
}
