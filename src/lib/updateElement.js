import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  for (const key in originOldProps) {
    if (!(key in originNewProps)) {
      if (key.startsWith("on") && typeof originOldProps[key] === "function") {
        const eventType = key.slice(2).toLowerCase();
        removeEvent(target, eventType, originOldProps[key]);
      } else {
        target.removeAttribute(key);
      }
    }
  }
  for (const key in originNewProps) {
    const newValue = originNewProps[key];
    const oldValue = originOldProps[key];

    if (newValue !== oldValue) {
      if (key.startsWith("on") && typeof newValue === "function") {
        const eventType = key.slice(2).toLowerCase();

        if (typeof oldValue === "function") {
          removeEvent(target, eventType, oldValue);
        }

        addEvent(target, eventType, newValue);
      } else if (key === "className") {
        target.setAttribute("class", newValue);
      } else {
        target.setAttribute(key, newValue);
      }
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!newNode && oldNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  if (newNode && !oldNode) {
    const $el = createElement(newNode);
    parentElement.appendChild($el);
    return;
  }

  if (
    typeof newNode === "string" &&
    typeof oldNode === "string" &&
    newNode !== oldNode
  ) {
    parentElement.childNodes[index].textContent = newNode;
    return;
  }

  if (newNode?.type !== oldNode?.type) {
    const $el = createElement(newNode);
    parentElement.replaceChild($el, parentElement.childNodes[index]);
    return;
  }
  if (newNode?.tag === oldNode?.tag) {
    const el = parentElement?.childNodes[index];
    if (!el) return;
    updateAttributes(el, newNode.props || {}, oldNode.props || {});

    const newChildren = newNode.children || [];
    const oldChildren = oldNode.children || [];

    const max = Math.max(newChildren.length, oldChildren.length);
    for (let i = 0; i < max; i++) {
      updateElement(el, newChildren[i], oldChildren[i], i);
    }
  }
}
