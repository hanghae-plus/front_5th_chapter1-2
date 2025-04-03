import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

const vNodeMap = new Map();

export function renderElement(vNode, container) {
  const newNode = normalizeVNode(vNode);

  // 초기 렌더링
  if (container.innerHTML === "") {
    const element = createElement(newNode);

    container.appendChild(element);
    setupEventListeners(container);
    vNodeMap.set(container, newNode);

    return;
  }

  // diff 알고리즘을 통해 렌더링
  const oldNode = vNodeMap.get(container);

  vNodeMap.set(container, newNode);
  updateElement(container, newNode, oldNode);
}
