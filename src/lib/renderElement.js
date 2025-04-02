import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

let initialVNode = null;

export function renderElement(vNode, container) {
  const normalizedVNode = normalizeVNode(vNode);

  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  if (!initialVNode) {
    initialVNode = normalizedVNode;
    const newElement = createElement(normalizedVNode);
    container.appendChild(newElement);
  } else {
    // 이후에는 updateElement로 기존 DOM을 업데이트한다.
    updateElement(container, normalizedVNode, initialVNode);
  }

  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  setupEventListeners(container);
}
