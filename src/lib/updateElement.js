import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, newProps = {}, oldProps = {}) {
  // 1. 이전 속성 제거
  for (const key in oldProps) {
    if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      removeEvent(target, eventType, oldProps[key]);
    } else if (!(key in newProps)) {
      // 더 이상 사용하지 않는 속성 제거
      if (key === "className") {
        target.className = "";
      } else {
        target.removeAttribute(key);
      }
    }
  }

  // 2. 새로운 속성 추가/업데이트
  for (const key in newProps) {
    if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      addEvent(target, eventType, newProps[key]);
    } else if (oldProps[key] !== newProps[key]) {
      // 속성 값이 변경된 경우에만 업데이트
      if (key === "className") {
        target.className = newProps[key];
      } else if (key === "style") {
        if (typeof newProps[key] === "string") {
          target.style.cssText = newProps[key];
        } else {
          Object.assign(target.style, newProps[key]);
        }
      } else {
        target.setAttribute(key, newProps[key]);
      }
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // 1. 노드 제거 (newNode가 없고 oldNode가 있는 경우)
  if (!newNode && oldNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  // 2. 새 노드 추가 (newNode가 있고 oldNode가 없는 경우)
  if (newNode && !oldNode) {
    const newElement = createElement(newNode);
    if (parentElement.childNodes[index]) {
      parentElement.insertBefore(newElement, parentElement.childNodes[index]);
    } else {
      parentElement.appendChild(newElement);
    }
    return;
  }

  // 3. 텍스트 노드 업데이트
  if (typeof newNode === "string" && typeof oldNode === "string") {
    parentElement.childNodes[index].nodeValue = newNode;
    return;
  }

  // 4. 노드 교체 (newNode와 oldNode의 타입이 다른 경우)
  if (newNode.type !== oldNode.type) {
    const newElement = createElement(newNode);
    if (parentElement.childNodes[index]) {
      parentElement.replaceChild(newElement, parentElement.childNodes[index]);
    } else {
      parentElement.appendChild(newElement);
    }
    return;
  }

  // 5. 같은 타입의 노드인 경우
  if (oldNode.type === newNode.type) {
    const currentElement = parentElement.childNodes[index];
    if (!currentElement) return;

    // 5-1. 속성 업데이트
    updateAttributes(currentElement, newNode.props, oldNode?.props);

    // 5-2. 자식 노드 재귀적으로 업데이트
    const newChildren = newNode.children || [];
    const oldChildren = oldNode?.children || [];
    const maxLength = Math.max(newChildren.length, oldChildren.length);

    for (let i = 0; i < maxLength; i++) {
      updateElement(currentElement, newChildren[i], oldChildren[i], i);
    }
  }
}
