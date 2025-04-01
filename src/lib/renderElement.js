import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

let previousVNode = null; // 이전 가상 DOM 트리 저장
export function renderElement(vNode, container) {
  // vNode 정규화
  const normalizedVNode = normalizeVNode(vNode);

  // 최초 렌더링인지 확인 (#root가 비어있는지 확인)
  const isInitialRender = container.childNodes.length === 0;

  if (isInitialRender) {
    // 최초 렌더링시에는 createElement로 DOM을 생성하고
    const element = createElement(normalizedVNode);
    container.replaceChildren(element);
  } else {
    // 이후에는 updateElement로 기존 DOM을 업데이트한다.
    updateElement(container, normalizedVNode, previousVNode);
  }

  previousVNode = normalizedVNode;
  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  setupEventListeners(container);
}
