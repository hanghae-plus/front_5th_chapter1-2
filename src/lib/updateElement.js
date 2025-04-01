import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

export function updateAttributes(target, originNewProps, originOldProps) {
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
  // 노드가 모두 없는 경우
  if (!oldNode && !newNode) {
    return;
  }

  // 이전 노드만 있는 경우 (삭제)
  if (oldNode && !newNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  // 이전 노드가 없고 새 노드만 있는 경우 (추가)
  if (!oldNode && newNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  // 둘 다 문자열이거나 숫자인 경우
  if (
    (typeof oldNode === "string" || typeof oldNode === "number") &&
    (typeof newNode === "string" || typeof newNode === "number")
  ) {
    if (oldNode !== newNode) {
      parentElement.childNodes[index].textContent = newNode;
    }
    return;
  }

  // 노드 타입이 다른 경우 (교체)
  if (oldNode.type !== newNode.type) {
    parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
    return;
  }

  // 속성 업데이트
  updateAttributes(
    parentElement.childNodes[index],
    newNode.props,
    oldNode.props,
  );

  // 자식 노드 업데이트
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

  const maxLength = Math.max(oldChildren.length, newChildren.length);

  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parentElement.childNodes[index],
      i < newChildren.length ? newChildren[i] : null,
      i < oldChildren.length ? oldChildren[i] : null,
      i,
    );
  }
}
