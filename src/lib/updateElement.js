import { addEvent, removeEvent } from "./eventManager";

import { extractEventTypeFromKey } from "../utils/eventUtils.js";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  if (!target) return;
  const newProps = originNewProps || {};
  const oldProps = originOldProps || {};

  Object.entries(newProps).forEach(([key, value]) => {
    if (key === "className") {
      target.setAttribute("class", value);
    } else if (key.startsWith("on")) {
      const eventType = extractEventTypeFromKey(key);
      addEvent(target, eventType, value);
    } else {
      target.setAttribute(key, value);
    }
  });

  Object.keys(oldProps)
    .filter((key) => !(key in newProps))
    .forEach((key) => {
      if (key.startsWith("on")) {
        const eventName = extractEventTypeFromKey(key);
        removeEvent(target, eventName);
      } else {
        target.removeAttribute(key);
      }
    });
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!parentElement) return;
  if (!newNode && !oldNode) return;

  if (!newNode && oldNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  if (newNode && !oldNode) {
    const el = createElement(newNode);
    parentElement.appendChild(el);
    return;
  }

  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode !== oldNode) {
      parentElement.childNodes[index].textContent = newNode;
    }
  }

  if (newNode.type !== oldNode.type) {
    const el = createElement(newNode);
    parentElement.childNodes[index].replaceWith(el);
    return;
  }

  updateAttributes(
    parentElement.childNodes[index],
    newNode.props,
    oldNode.props,
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
