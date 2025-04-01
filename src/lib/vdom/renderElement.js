import { setupEventListeners } from "../event";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

const prevVNodeMap = new WeakMap();

export function renderElement(vNode, container) {
  const normalizedNode = normalizeVNode(vNode);
  const prevVNode = prevVNodeMap.get(container);

  prevVNode
    ? updateElement(container, normalizedNode, prevVNode)
    : container.replaceChildren(createElement(normalizedNode));

  prevVNodeMap.set(container, normalizedNode);
  setupEventListeners(container);
}
