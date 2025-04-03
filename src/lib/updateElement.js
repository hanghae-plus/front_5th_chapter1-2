import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  for (const key in originOldProps) {
    if (!(key in originNewProps)) {
      target.removeAttribute(key);

      const oldVal = originOldProps[key];
      if (key.startsWith("on") && typeof oldVal === "function") {
        const eventType = key.slice(2).toLowerCase();
        removeEvent(target, eventType, oldVal);
      }
    }
  }

  for (const key in originNewProps) {
    const newValue = originNewProps[key];
    const oldValue = originOldProps[key];

    if (newValue !== oldValue) {
      if (key === "className") {
        target.setAttribute("class", newValue);
      } else if (key === "id") {
        target.setAttribute(key, newValue);
      } else if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        addEvent(target, eventType, newValue);
      } else {
        target.setAttribute(key, newValue);
      }
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!oldNode && newNode) {
    const newEl = createElement(newNode);
    parentElement.appendChild(newEl);
    return;
  }

  if (oldNode && !newNode) {
    const oldEl = parentElement.childNodes[index];
    parentElement.removeChild(oldEl);
    return;
  }

  if (typeof oldNode === "string" && typeof newNode === "string") {
    if (oldNode !== newNode) {
      parentElement.replaceChild(
        createElement(newNode),
        parentElement.childNodes[index],
      );
    }
    return;
  }

  if (oldNode.type !== newNode.type) {
    const newEl = createElement(newNode);
    parentElement.replaceChild(newEl, parentElement.childNodes[index]);
    return;
  }

  updateAttributes(
    parentElement.childNodes[index],
    newNode.props ?? {},
    oldNode.props ?? {},
  );

  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];
  const maxLength = Math.max(newChildren.length, oldChildren.length);

  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parentElement.childNodes[index],
      newChildren[i],
      oldChildren[i],
      i,
    );
  }
}
