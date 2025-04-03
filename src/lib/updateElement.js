import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement";

function updateAttributes(target, originNewProps, originOldProps) {
  const newProps = originNewProps || {};
  const oldProps = originOldProps || {};

  // 이전 속성 제거
  for (const key in oldProps) {
    if (key.startsWith("on") && typeof oldProps[key] === "function") {
      const eventType = key.slice(2).toLowerCase();
      if (!newProps[key]) {
        removeEvent(target, eventType, oldProps[key]);
      }
    }
    if (key !== "children" && !(key in newProps)) {
      if (key === "className") {
        target.removeAttribute("class");
      } else {
        target.removeAttribute(key);
      }
    }
  }

  // 새로운 속성 추가/업데이트
  for (const key in newProps) {
    if (key.startsWith("on") && typeof newProps[key] === "function") {
      const eventType = key.slice(2).toLowerCase();
      if (oldProps[key] !== newProps[key]) {
        if (oldProps[key]) {
          removeEvent(target, eventType, oldProps[key]);
        }
        addEvent(target, eventType, newProps[key]);
      }
    } else if (key !== "children" && oldProps[key] !== newProps[key]) {
      if (key === "className") {
        target.setAttribute("class", newProps[key]);
      } else {
        target.setAttribute(key, newProps[key]);
      }
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!parentElement) return;

  if (!oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  if (!newNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  const currentElement = parentElement.childNodes[index];

  if (typeof newNode === "string" || typeof newNode === "number") {
    if (oldNode !== newNode) {
      if (typeof oldNode === "object") {
        parentElement.replaceChild(
          document.createTextNode(String(newNode)),
          currentElement
        );
      } else {
        currentElement.textContent = String(newNode);
      }
    }
    return;
  }

  if (oldNode.type !== newNode.type) {
    parentElement.replaceChild(
      createElement(newNode),
      currentElement
    );
    return;
  }

  updateAttributes(currentElement, newNode.props, oldNode.props);

  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];
  const maxLength = Math.max(newChildren.length, oldChildren.length);

  for (let i = 0; i < maxLength; i++) {
    updateElement(
      currentElement,
      newChildren[i],
      oldChildren[i],
      i
    );
  }
}