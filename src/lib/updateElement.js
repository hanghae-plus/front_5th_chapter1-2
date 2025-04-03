import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  for (const [key] of Object.entries(originOldProps)) {
    if (key.startsWith("on") && !(key in originNewProps)) {
      const eventType = key.slice(2).toLowerCase();
      removeEvent(target, eventType);
    }
  }

  for (const [key, value] of Object.entries(originNewProps)) {
    if (key === "className") {
      target.setAttribute("class", value);
    } else if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      addEvent(target, eventType, value);
    } else {
      target.setAttribute(key, value);
    }
  }
}

export function updateElement(target, newNode, oldNode, index = 0) {
  if (!oldNode && newNode) {
    // 새로운 노드 추가
    target.appendChild(createElement(newNode));
    return;
  }

  if (!newNode && oldNode) {
    // 기존 노드 제거
    target.removeChild(target.childNodes[index]);
    return;
  }

  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode !== oldNode) {
      target.replaceChild(createElement(newNode), target.childNodes[index]);
    }
    return;
  }

  if (newNode.type !== oldNode.type) {
    // 노드가 다르면 교체
    target.replaceChild(createElement(newNode), target.childNodes[index]);
    return;
  }

  // 속성 업데이트
  updateAttributes(
    target.childNodes[index],
    newNode.props || {},
    oldNode.props || {},
  );

  // 자식 노드 업데이트
  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];
  const max = Math.max(newChildren.length, oldChildren.length);
  for (let i = 0; i < max; i++) {
    updateElement(target.childNodes[index], newChildren[i], oldChildren[i], i);
  }
}
