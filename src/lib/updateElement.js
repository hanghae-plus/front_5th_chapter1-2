import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, newProps = {}, oldProps = {}) {
  // 1. 기존 이벤트 핸들러 제거
  for (const key in oldProps) {
    if (typeof oldProps[key] === "function" && key.startsWith("on")) {
      const eventType = key.toLowerCase().substring(2);

      // 새 Props에 이벤트가 없거나 다른 함수라면 제거
      if (!(key in newProps) || newProps[key] !== oldProps[key]) {
        removeEvent(target, eventType, oldProps[key]);
      }
    }
  }

  // 2. 새 속성 추가 및 업데이트
  for (const [key, newValue] of Object.entries(newProps)) {
    if (newValue === oldProps[key]) continue;

    if (typeof newValue === "function" && key.startsWith("on")) {
      const eventType = key.toLowerCase().substring(2);
      addEvent(target, eventType, newValue);
      continue;
    }

    if (key === "className") {
      target.className = newValue;
      continue;
    }

    if (key in target) {
      target[key] = newValue;
      continue;
    }

    if (newValue != null && newValue !== false) {
      target.setAttribute(key, newValue);
    }
  }

  // 3. 삭제된 속성 정리
  for (const key in oldProps) {
    if (key in newProps) continue;

    if (key === "className") {
      target.className = "";
      continue;
    }

    if (key in target) {
      target[key] = "";
      continue;
    }

    target.removeAttribute(key);
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  const currentElement = parentElement.childNodes[index];

  if (!oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  if (!newNode) {
    parentElement.removeChild(currentElement);
    return;
  }

  if (newNode.type !== oldNode.type) {
    parentElement.replaceChild(createElement(newNode), currentElement);
    return;
  }

  if (typeof newNode !== "object") {
    if (newNode !== oldNode) currentElement.nodeValue = newNode;
    return;
  }

  updateAttributes(currentElement, newNode.props ?? {}, oldNode.props ?? {});

  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];
  const maxLength = Math.max(newChildren.length, oldChildren.length);

  for (let i = 0; i < maxLength; i++) {
    updateElement(currentElement, newChildren[i], oldChildren[i], i);
  }
}
