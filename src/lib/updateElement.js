import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";
import { normalizeVNode } from "./normalizeVNode.js";

function updateAttributes(target, originNewProps, originOldProps) {
  for (const key in originOldProps) {
    if ((!key) in originNewProps) {
      target.removeAttribute(key);
    }
  }

  for (const key in originNewProps) {
    if (originOldProps[key] !== originNewProps[key]) {
      target.setAttribute(key, originNewProps[key]);
    }
  }
}

function changed(node1, node2) {
  return (
    typeof node1 !== typeof node2 ||
    (typeof node1 === "string" && node1 !== node2) ||
    node1.type !== node2.type
  );
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  const updatedNode = createElement(normalizeVNode(newNode));

  if (!newNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
  } else if (changed(oldNode, newNode)) {
    parentElement.replaceChild(updatedNode, parentElement.childNodes[index]);
  } else if (newNode.type) {
    updateAttributes(
      parentElement.childNodes[index],
      newNode.props,
      oldNode.props,
    );

    const max = Math.max(newNode.children.length, oldNode.children.length);
    for (let i = 0; i < max; i++) {
      updateElement(
        parentElement.childNodes[index],
        newNode.children[i],
        oldNode.children[i],
      );
    }
  }
}
