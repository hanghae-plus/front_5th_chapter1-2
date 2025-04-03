import { createElement } from "./createElement";
import { setupEventListeners } from "./eventManager";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  // 1. 최초 렌더링시에는 createElement로 DOM을 생성하고
  // vNode를 정규화 한 다음에
  // createElement로 노드를 만들고
  // container에 삽입하고
  // 2. 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 3. 렌더링이 완료되면 container에 이벤트를 등록한다.
  // 이벤트를 등록합니다.

  const hasPrevNode = container._prevNode;
  const normalizedVNode = normalizeVNode(vNode);

  if (!hasPrevNode) {
    const element = createElement(normalizedVNode);
    container.replaceChildren(element);
  } else {
    updateElement(container, normalizedVNode, container._prevNode);
  }
  container._prevNode = normalizedVNode;
  setupEventListeners(container);
}
