import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

const elementMap = new Map();

export function renderElement(vNode, container) {
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.

  const normalizeNode = normalizeVNode(vNode);
  const isFirstRender = container.children.length === 0;

  if (isFirstRender) {
    const element = createElement(normalizeNode);
    container.appendChild(element);
  } else {
    const oldVNode = elementMap.get("vNode");
    updateElement(container, normalizeNode, oldVNode);
  }

  elementMap.set("vNode", normalizeNode);
  setupEventListeners(container);
}
