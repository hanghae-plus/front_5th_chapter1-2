import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

// 이전 노드를 저장하기 위한 맵 : container를 키로 사용하고 해당 컨테이너에 마지막으로 렌더링된 vNode를 값으로 저장
const oldNodeMap = new WeakMap();

export function renderElement(vNode, container) {
  const oldNode = oldNodeMap.get(container);
  // vNode를 정규화한 신규 노드
  const newNode = normalizeVNode(vNode);

  // 기존 DOM(oldNode)이 없으면 신규 엘리먼트를 생성 후 container에 추가
  if (!oldNode) {
    const newElement = createElement(newNode);
    container.appendChild(newElement);
  } else {
    // 기존 DOM이 있으면 업데이트
    updateElement(container, newNode, oldNode);
  }

  oldNodeMap.set(container, newNode);

  // 렌더링 완료후 container에 이벤트 리스너 설정
  setupEventListeners(container);
}
