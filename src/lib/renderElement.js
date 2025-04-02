import { removeEvent, setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
// import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  const normalizedVNode = normalizeVNode(vNode);
  const $el = createElement(normalizedVNode);
  const oldVNode = container._vnode;

  if (oldVNode && oldVNode.props) {
    for (const key in oldVNode.props) {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        removeEvent(oldVNode.el, eventType, oldVNode.props[key]);
      }
    }
  }

  container.innerHTML = "";

  container.appendChild($el);

  if (!container._isInitialized) {
    setupEventListeners(container);
    container._isInitialized = true;
  }

  // 다음 diff를 위해 vnode 저장
  container._vnode = {
    ...normalizedVNode,
    el: $el, // 직접 DOM도 연결해줌 (removeEvent 쓸 때 필요)
  };
}
