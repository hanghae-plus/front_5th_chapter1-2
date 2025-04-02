import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  const attributes = new Set([
    ...Object.keys(originNewProps),
    ...Object.keys(originOldProps),
  ]);

  attributes.forEach((key) => {
    if (originNewProps[key] === originOldProps[key]) {
      return;
    }

    if (key.startsWith("on")) {
      removeEvent(target, key.slice(2).toLowerCase());
      addEvent(target, key.slice(2).toLowerCase(), originNewProps[key]);
    } else {
      target.setAttribute(
        key === "className" ? "class" : key,
        originNewProps[key],
      );
    }
  });
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!newNode && oldNode) {
    return parentElement.removeChild(parentElement.childNodes[index]);
  }

  if (newNode && !oldNode) {
    return parentElement.appendChild(createElement(newNode));
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
      parentElement.replaceChild(createElement(newNode), oldNodeElement);
      return;
    }
    return parentElement.append(createElement(newNode));
  }

  const $el = parentElement.childNodes[index];
  updateAttributes($el, newNode.props || {}, oldNode.props || {});

  const newNodeChildren = newNode.children || [];
  const oldNodeChildren = oldNode.children || [];
  const maxLength = Math.max(newNodeChildren.length, oldNodeChildren.length);
  for (let i = 0; i < maxLength; i++) {
    updateElement($el, newNodeChildren[i], oldNodeChildren[i], i);
  }
}
