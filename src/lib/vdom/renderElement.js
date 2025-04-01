import { setupEventListeners } from "../event";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

const prevVNodeMap = new WeakMap();

export function renderElement(vNode, container) {
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.

  const normalizedNode = normalizeVNode(vNode);
  const prevVNode = prevVNodeMap.get(container);

  if (prevVNode) {
    updateElement(container, normalizedNode, prevVNode);
  } else {
    const $el = createElement(normalizedNode);
    container.replaceChildren($el);
  }

  prevVNodeMap.set(container, normalizedNode); // ✅ 컨테이너별 이전 VNode 저장
  setupEventListeners(container);
}
