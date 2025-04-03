import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  const childNode = parentElement.childNodes[index];

  if (!newNode && oldNode) {
    parentElement.removeChild(childNode);
    return;
  }

  if (newNode && !oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode === oldNode) return;
    parentElement.replaceChild(createElement(newNode), childNode);
    return;
  }

  if (newNode.type !== oldNode.type) {
    parentElement.replaceChild(createElement(newNode), childNode);
    return;
  }

  updateAttributes(childNode, newNode.props || {}, oldNode.props || {});

  const maxLength = Math.max(newNode.children.length, oldNode.children.length);
  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parentElement.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}

function updateAttributes(target, newProps, oldProps) {
  Object.keys(oldProps).forEach((key) => {
    if (key.startsWith("on") && typeof oldProps[key] === "function") {
      removeEvent(target, key.substring(2).toLowerCase(), oldProps[key]);
    }
  });

  Object.entries(newProps).forEach(([key, value]) => {
    if (key === "className") {
      target.setAttribute("class", value);
    } else if (key.startsWith("on") && typeof value === "function") {
      addEvent(target, key.slice(2).toLowerCase(), value);
    } else {
      target.setAttribute(key, value);
    }
  });
}
