import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

/**
 * 최초 렌더링시에는 createElement로 DOM을 생성하고
 * 이후에는 updateElement로 기존 DOM을 업데이트한다.
 *  렌더링이 완료되면 container에 이벤트를 등록한다.
 */

export function renderElement(vNode, container) {
  // container에 _oldChildren이 없다면 최초 렌더링
  const isCreate = !container._prevVNode;
  const normalizedVNode = normalizeVNode(vNode);

  if (isCreate) {
    const el = createElement(normalizedVNode);
    container.replaceChildren(el);
  } else {
    updateElement(container, normalizedVNode, container._prevVNode);
  }

  container._prevVNode = normalizedVNode;
  setupEventListeners(container);
}
