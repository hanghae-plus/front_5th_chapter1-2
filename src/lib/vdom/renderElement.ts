import { setupEventListeners } from "../event";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";
import { RawVNode } from "./types";

const prevVNodeMap = new WeakMap();

export function renderElement(vNode: RawVNode, container: HTMLElement) {
  const normalizedNode = normalizeVNode(vNode);
  const prevVNode = prevVNodeMap.get(container);

  if (prevVNode) {
    updateElement(container, normalizedNode, prevVNode);
  } else {
    container.replaceChildren(createElement(normalizedNode));
  }

  prevVNodeMap.set(container, normalizedNode);
  setupEventListeners(container);
}
