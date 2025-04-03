// import { addEvent, removeEvent } from "./eventManager";
// import { createElement } from "./createElement.js";
// import { normalizeVNode } from "./normalizeVNode.js";

// function updateAttributes(target, originNewProps, originOldProps) {}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  parentElement.innerHTML = "";
  parentElement.appendChild(newNode);
  return {
    parentElement,
    newNode,
    oldNode,
    index,
  };
}
