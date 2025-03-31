import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  const newProps = originNewProps || {};
  const oldProps = originOldProps || {};

  Object.keys(oldProps).forEach((key) => {
    if (key.startsWith("on") && typeof oldProps[key] === "function") {
      const eventType = key.substring(2).toLowerCase();
      if (!newProps[key]) {
        removeEvent(target, eventType, oldProps[key]);
      }
    } else if (key === "className") {
      if (!newProps[key]) {
        target.removeAttribute("class");
      }
    } else if (!(key in newProps)) {
      target.removeAttribute(key);
    }
  });

  Object.keys(newProps).forEach((key) => {
    if (key.startsWith("on") && typeof newProps[key] === "function") {
      const eventType = key.substring(2).toLowerCase();

      if (oldProps[key]) {
        removeEvent(target, eventType, oldProps[key]);
      }

      addEvent(target, eventType, newProps[key]);
    } else if (key === "className") {
      target.setAttribute("class", newProps[key]);
    } else if (oldProps[key] !== newProps[key]) {
      target.setAttribute(key, newProps[key]);
    }
  });
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (Array.isArray(newNode)) {
    newNode = { type: "fragment", children: newNode };
  }

  if (Array.isArray(oldNode)) {
    oldNode = { type: "fragment", children: oldNode };
  }

  if (!oldNode) {
    const newElement = createElement(newNode);
    if (newElement) {
      parentElement.appendChild(newElement);
    }
    return;
  }

  if (!newNode) {
    if (parentElement.childNodes[index]) {
      parentElement.removeChild(parentElement.childNodes[index]);
    }
    return;
  }

  if (typeof newNode !== "object" && typeof oldNode !== "object") {
    if (newNode !== oldNode) {
      if (parentElement.childNodes[index]) {
        parentElement.replaceChild(
          document.createTextNode(String(newNode)),
          parentElement.childNodes[index],
        );
      } else {
        parentElement.appendChild(document.createTextNode(String(newNode)));
      }
    }
    return;
  }

  if (!newNode || !oldNode) {
    return;
  }

  if (
    typeof newNode !== typeof oldNode ||
    (typeof newNode === "object" &&
      typeof oldNode === "object" &&
      newNode.type !== oldNode.type)
  ) {
    const newElement = createElement(newNode);
    if (newElement && parentElement.childNodes[index]) {
      parentElement.replaceChild(newElement, parentElement.childNodes[index]);
    } else if (newElement) {
      parentElement.appendChild(newElement);
    }
    return;
  }

  if (typeof newNode === "object" && typeof oldNode === "object") {
    const element = parentElement.childNodes[index];

    if (!element) {
      parentElement.appendChild(createElement(newNode));
      return;
    }

    updateAttributes(element, newNode.props, oldNode.props);

    const newChildren = Array.isArray(newNode.children)
      ? newNode.children
      : newNode.children
        ? [newNode.children]
        : [];
    const oldChildren = Array.isArray(oldNode.children)
      ? oldNode.children
      : oldNode.children
        ? [oldNode.children]
        : [];

    const maxLength = Math.max(newChildren.length, oldChildren.length);

    for (let i = 0; i < maxLength; i++) {
      updateElement(
        element,
        i < newChildren.length ? newChildren[i] : null,
        i < oldChildren.length ? oldChildren[i] : null,
        i,
      );
    }
  }
}
