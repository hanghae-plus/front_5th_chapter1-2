import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

let previousNode = null;

/**
 * 최초 렌더링시에는 createElement로 DOM을 생성하고
 * 이후에는 updateElement로 기존 DOM을 업데이트한다.
 * 렌더링이 완료되면 container에 이벤트를 등록한다.
 * @param {*} vNode 렌더링할 노드
 * @param {*} container 렌더링할 컨테이너
 */
export function renderElement(vNode, container) {
  const normalizedNode = normalizeVNode(vNode);

  if (!container.firstChild) {
    // 초기 렌더링인 경우
    const element = createElement(normalizedNode);
    container.innerHTML = "";
    container.appendChild(element);
    previousNode = normalizedNode;
  } else {
    // 업데이트 렌더링인 경우
    updateElement(container, normalizedNode, previousNode);
    previousNode = normalizedNode;
  }

  setupEventListeners(container);
}
