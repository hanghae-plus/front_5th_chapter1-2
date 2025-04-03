import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

/*
 * 가상 DOM 노드를 실제 DOM에 렌더링하는 함수
 * 렌더링할 가상 DOM 노드와 렌더링 할 컨테이너 요소를 인자로 받는다.
 * */
export function renderElement(vNode, container) {
  // vNode를 정규화 (함수형 컴포넌트를 HTML 요소로 변환)
  const normalizedVNode = normalizeVNode(vNode);

  if (container.oldNode) {
    updateElement(container, normalizedVNode, container.oldNode);
  } else {
    const el = createElement(normalizedVNode);
    container.replaceChildren(el);
  }
  container.oldNode = normalizedVNode;

  setupEventListeners(container);
}
