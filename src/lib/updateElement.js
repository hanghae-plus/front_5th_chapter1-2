import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, newProps, oldProps) {
  // 1. 이전 속성/이벤트 처리
  if (oldProps) {
    for (const propName in oldProps) {
      // 이벤트 핸들러
      if (
        propName.startsWith("on") &&
        typeof oldProps[propName] === "function"
      ) {
        const eventType = propName.toLowerCase().substring(2);

        // null 안전 접근
        const newValue = newProps ? newProps[propName] : undefined;
        if (!newValue || newValue !== oldProps[propName]) {
          removeEvent(target, eventType, oldProps[propName]);
        }
      }
      // 일반 속성
      else if (propName !== "children") {
        // newProps가 null이 아니고, 해당 속성이 없을 때만 제거
        if (!newProps || !(propName in newProps)) {
          target.removeAttribute(propName);
        }
      }
    }
  }

  // 2. 새 속성/이벤트 추가
  if (newProps) {
    for (const propName in newProps) {
      if (propName === "children") continue;

      // oldProps가 null이 아니고 값이 같을 때만 스킵
      const oldValue = oldProps ? oldProps[propName] : undefined;
      if (oldValue === newProps[propName]) continue;

      // 이벤트 핸들러 추가
      if (
        propName.startsWith("on") &&
        typeof newProps[propName] === "function"
      ) {
        const eventType = propName.toLowerCase().substring(2);
        addEvent(target, eventType, newProps[propName]);
      }
      // 일반 속성 설정
      else if (propName !== "children") {
        if (propName === "className") {
          target.className = newProps[propName];
        } else {
          target.setAttribute(propName, newProps[propName]);
        }
      }
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!oldNode) return parentElement.appendChild(createElement(newNode));

  if (typeof newNode !== "object" && typeof oldNode !== "object") {
    if (newNode !== oldNode) {
      const targetNode = parentElement.childNodes[index];

      if (targetNode) {
        parentElement.replaceChild(createElement(newNode), targetNode);
      } else {
        parentElement.appendChild(createElement(newNode));
      }
    }

    return;
  }

  if (oldNode.type !== newNode.type) {
    const targetNode = parentElement.childNodes[index];

    if (targetNode) {
      parentElement.replaceChild(createElement(newNode), targetNode);
    } else {
      parentElement.appendChild(createElement(newNode));
    }

    return;
  }

  const currentElement = parentElement.childNodes[index];
  updateAttributes(currentElement, newNode.props, oldNode.props);

  const oldLength = oldNode.children?.length || 0;
  const newLength = newNode.children?.length || 0;

  for (let i = 0; i < Math.min(oldLength, newLength); i++) {
    updateElement(currentElement, newNode.children[i], oldNode.children[i], i);
  }

  if (newLength > oldLength) {
    for (let i = oldLength; i < newLength; i++) {
      currentElement.appendChild(createElement(newNode.children[i]));
    }
  }

  if (oldLength > newLength) {
    for (let i = newLength; i < oldLength; i++) {
      currentElement.removeChild(currentElement.childNodes[newLength]);
    }
  }
}
