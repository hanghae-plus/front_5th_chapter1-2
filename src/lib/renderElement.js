import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

// https://ko.javascript.info/weakmap-weakset
const elementMap = new Map();

/**
 * @param {VNode} vNode
 * @param {HTMLElement} container
 */
export function renderElement(vNode, container) {
  // 정규화
  const normalizedVNode = normalizeVNode(vNode);

  const isFirstRender = container.children.length === 0;

  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  if (isFirstRender) {
    const newElement = createElement(normalizedVNode);
    container.appendChild(newElement);

    // 이벤트 등록
    setupEventListeners(container);
  }
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  else {
    const oldVNode = elementMap.get("vNode");
    updateElement(container, normalizedVNode, oldVNode);
  }

  elementMap.set("vNode", normalizedVNode);
}
