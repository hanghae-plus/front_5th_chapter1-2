import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";
import { extractEventTypeFromKey } from "../utils/eventUtils.js";

// 요소의 속성
function updateAttributes(target, originNewProps, originOldProps) {
  if (!target) return;
  const newProps = originNewProps || {};
  const oldProps = originOldProps || {};

  // 새로운 속성 추가 + 기존 속성 업데이트
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

  // oldProps에 있지만 newProps에서 사라진 prop 제거
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
  if (!newNode && oldNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }
  if (newNode && !oldNode) {
    const newElement = createElement(newNode);
    parentElement.append(newElement);
    return;
  }
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode != oldNode) {
      parentElement.childNodes[index].textContent = newNode;
    }
    return;
  }
  if (newNode.type !== oldNode.type) {
    const newElement = createElement(newNode);
    const oldElement = parentElement.childNodes[index];
    if (oldElement) {
      parentElement.replaceChild(newElement, parentElement.childNodes[index]);
      return;
    }
    parentElement.appendChild(newElement);
    return;
  }

  const element = parentElement.childNodes[index];
  const newChildren = newNode.children;
  const oldChildren = oldNode.children;
  const maxLength = Math.max(newChildren.length, oldChildren.length);

  updateAttributes(element, newNode.props, oldNode.props);

  for (let i = 0; i < maxLength; i++) {
    updateElement(element, newChildren?.[i], oldChildren?.[i], i);
  }
}
