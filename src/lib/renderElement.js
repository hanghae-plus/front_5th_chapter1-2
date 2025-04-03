import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

const containerVNodeMap = new WeakMap();

export function renderElement(vNode, container) {
  const normalizedVNode = normalizeVNode(vNode);

  const prevVNode = containerVNodeMap.get(container);

  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  if (!prevVNode) {
    const newElement = createElement(normalizedVNode);
    container.appendChild(newElement);
    setupEventListeners(container);
  } else {
    // 이후에는 updateElement로 기존 DOM을 업데이트한다.
    updateElement(container, normalizedVNode, prevVNode);
  }

  containerVNodeMap.set(container, normalizedVNode);
}
