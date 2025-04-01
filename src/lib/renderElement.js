import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
// import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

// 이전 vNode 저장
let nodeArray = [];
export function renderElement(vNode, container) {
  if (!container || !(container instanceof HTMLElement)) {
    throw new Error("올바른 컨테이너 요소가 필요합니다.");
  }
  if (nodeArray.length === 0) {
    container.innerHTML = "";
    const element = createElement(vNode);
    if (element) {
      container.appendChild(element);
    }
    nodeArray.push(vNode);
  } else {
    const previousVNode = nodeArray[0];

    updateElement(container, vNode, previousVNode);

    nodeArray = [vNode];
  }
  // 최초 렌더링시에는 createElement로 DOM을 생성하고

  // 이전 vNode와 새 vNode로 업데이트 수행

  // 현재 vNode를 이전 vNode로 저장

  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  setupEventListeners(container);
}
