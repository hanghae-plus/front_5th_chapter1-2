import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  if (originOldProps) {
    for (const [key, value] of Object.entries(originOldProps)) {
      if (key.startsWith("on")) {
        removeEvent(target, key.replace("on", "").toLowerCase(), value);
      }
    }
  }

  if (originNewProps) {
    for (const [key, value] of Object.entries(originNewProps)) {
      if (key === "className") {
        target.setAttribute("class", value);
      } else if (key.startsWith("on")) {
        addEvent(target, key.replace("on", "").toLowerCase(), value);
      } else {
        target.setAttribute(key, value);
      }
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  const currentNode = parentElement.childNodes[index];

  if (newNode && !oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  if (!newNode && oldNode) {
    parentElement.removeChild(currentNode);
    return;
  }

  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode === oldNode) return;
    parentElement.replaceChild(createElement(newNode), currentNode);
    return;
  }

  if (newNode.type !== oldNode.type) {
    parentElement.replaceChild(createElement(newNode), currentNode);
    return;
  }

  updateAttributes(currentNode, newNode.props, oldNode.props);
  const maxLength = Math.max(newNode.children.length, oldNode.children.length);
  for (let i = 0; i < maxLength; i++) {
    updateElement(currentNode, newNode.children[i], oldNode.children[i], i);
  }
}
