import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";
import { extractEventKey, isEvent } from "../utils/eventUtils.js";

function updateAttributes(target, originNewProps, originOldProps) {
  const attributes = new Set([
    ...Object.keys(originNewProps),
    ...Object.keys(originOldProps),
  ]);

  attributes.forEach((key) => {
    const newPropValue = originNewProps[key];
    if (newPropValue === originOldProps[key]) {
      return;
    }

    if (isEvent(key)) {
      const eventKey = extractEventKey(key);
      removeEvent(target, eventKey);
      addEvent(target, eventKey, newPropValue);
    } else {
      if (newPropValue) {
        target.setAttribute(key === "className" ? "class" : key, newPropValue);
      } else {
        target.removeAttribute(key === "className" ? "class" : key);
      }
    }
  });
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!parentElement) {
    return;
  }

  if (!newNode && oldNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  if (newNode && !oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode !== oldNode) {
      parentElement.childNodes[index].textContent = newNode;
    }
    return;
  }

  if (newNode.type !== oldNode.type) {
    const oldNodeElement = parentElement.childNodes[index];
    if (oldNodeElement) {
      oldNodeElement.replaceWith(createElement(newNode));
      return;
    }
    parentElement.appendChild(createElement(newNode));
    return;
  }

  const $el = parentElement.childNodes?.[index];
  if (newNode.type === oldNode.type) {
    updateAttributes($el, newNode.props || {}, oldNode.props || {});
  }

  const newNodeChildren = newNode.children || [];
  const oldNodeChildren = oldNode.children || [];
  const maxLength = Math.max(newNodeChildren.length, oldNodeChildren.length);
  for (let i = 0; i < maxLength; i++) {
    updateElement($el, newNodeChildren[i], oldNodeChildren[i], i);
  }
}
