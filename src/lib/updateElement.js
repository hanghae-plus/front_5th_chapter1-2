import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  if (!target) return;
  for (const key in originNewProps) {
    const newValue = originNewProps[key];
    const oldValue = originOldProps[key];

    if (newValue !== oldValue) {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        removeEvent(target, eventType, oldValue);
        addEvent(target, eventType, newValue);
      } else if (key === "className") {
        target.className = newValue;
      } else {
        target.setAttribute(key, newValue);
      }
    }
  }
  for (const key in originOldProps) {
    const oldValue = originOldProps[key];
    if (!(key in originNewProps)) {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        removeEvent(target, eventType, oldValue);
      } else {
        target.removeAttribute(key);
      }
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!parentElement) return;
  if (!newNode && !oldNode) return;

  const existingNode = parentElement.childNodes[index];

  if (!newNode && oldNode) {
    parentElement.removeChild(existingNode);
    return;
  }

  if (newNode && !oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  if (typeof newNode === "number" || typeof newNode === "string") {
    if (newNode !== oldNode) {
      parentElement.childNodes[index].textContent = newNode;
    }
    return;
  }

  if (newNode.type !== oldNode.type) {
    const el = createElement(newNode);
    existingNode.replaceWith(el);
    return;
  }
  updateAttributes(existingNode, newNode.props || {}, oldNode.props || {});
  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];

  const max = Math.max(newChildren.length, oldChildren.length);

  for (let i = 0; i < max; i++) {
    updateElement(existingNode, newChildren[i], oldChildren[i], i);
  }
}
