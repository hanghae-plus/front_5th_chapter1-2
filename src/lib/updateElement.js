import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

// TODO: 함수 새로 만들어서 중복 코드 제거
function updateAttributes(target, originNewProps, originOldProps) {
  Object.entries(originNewProps).forEach(([key, value]) => {
    if (originOldProps[key] !== value) {
      if (key.indexOf("on") === 0) {
        const eventType = key.slice(2).toLowerCase();
        addEvent(target, eventType, value);
      } else if (key === "className") {
        target.setAttribute("class", value);
      } else {
        target.setAttribute(key, value);
      }
    }
  });

  Object.entries(originOldProps).forEach(([key, value]) => {
    if (!originNewProps[key]) {
      if (key.indexOf("on") === 0) {
        const eventType = key.slice(2).toLowerCase();
        removeEvent(target, eventType, value);
      } else if (key === "className") {
        target.removeAttribute("class");
      } else {
        target.removeAttribute(key);
      }
    }
  });
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  const currentElement = parentElement.childNodes[index];

  if (!newNode && oldNode) {
    return parentElement.removeChild(currentElement);
  }
  if (newNode && !oldNode) {
    return parentElement.appendChild(createElement(newNode));
  }
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode === oldNode) return;
    currentElement.textContent = newNode;
    return;
  }
  if (newNode.type !== oldNode.type) {
    return parentElement.replaceChild(createElement(newNode), currentElement);
  }

  updateAttributes(currentElement, newNode.props || {}, oldNode.props || {});

  const maxLength = Math.max(newNode.children.length, oldNode.children.length);

  for (let i = 0; i < maxLength; i++) {
    updateElement(currentElement, newNode.children[i], oldNode.children[i], i);
  }
}
