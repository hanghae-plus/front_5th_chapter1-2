import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

// 이전 vNode 저장
const prevVirtualNodes = new WeakMap();

export function renderElement(vNode, container) {
  if (!container || !(container instanceof HTMLElement)) {
    throw new Error("올바른 컨테이너 요소가 필요합니다.");
  }

  const normalizedNode = normalizeVNode(vNode);
  const prevVNode = prevVirtualNodes.get(container);

  if (!prevVNode) {
    // 최초 렌더링
    const element = createElement(normalizedNode);
    container.innerHTML = ""; // 컨테이너를 비우고
    container.appendChild(element); // DOM에 추가
    prevVirtualNodes.set(container, normalizedNode);
  } else {
    // 이전 가상 노드와 비교하여 업데이트
    updateElement(container, normalizedNode, prevVNode);
    prevVirtualNodes.set(container, normalizedNode);
  }
  setupEventListeners(container);
}
