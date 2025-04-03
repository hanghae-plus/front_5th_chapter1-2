import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, newProps, oldProps) {
  // 기존 속성 제거
  for (const key in oldProps) {
    if (key.startsWith("on") && typeof oldProps[key] === "function") {
      const eventType = key.toLowerCase().substring(2);

      // 새 Props에 이벤트가 없거나 다른 함수인 경우 제거
      if (!(key in newProps) || newProps[key] !== oldProps[key]) {
        removeEvent(target, eventType, oldProps[key]);
      }
    } else if (!(key in newProps)) {
      // 일반 속성 제거
      if (key === "className") {
        target.removeAttribute("class");
      } else if (key !== "children") {
        target.removeAttribute(key);
      }
    }
  }

  // 새 속성 추가
  for (const key in newProps) {
    // 값 변경된 경우에만 처리
    if (newProps[key] !== oldProps[key]) {
      if (key.startsWith("on") && typeof oldProps[key] === "function") {
        const eventType = key.toLowerCase().substring(2);
        addEvent(target, eventType, newProps[key]);
      } else if (key === "className") {
        target.setAttribute("class", newProps[key]);
      } else if (key !== "children") {
        if (newProps[key] === true) {
          target.setAttribute(key, "");
        } else if (
          newProps[key] !== false &&
          newProps[key] !== null &&
          newProps[key] !== undefined
        ) {
          target.setAttribute(key, newProps[key]);
        } else {
          target.removeAttribute(key);
        }
      }
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!parentElement) return;

  // 새 노드만 있는 경우
  if (!oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  // 기존 노드만 있는 경우
  if (!newNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  // 두 노드 타입이 다른 경우 교체
  if (oldNode.type !== newNode.type) {
    parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
    return;
  }

  // 두 노드가 문자열 인 경우
  if (typeof oldNode === "string" && typeof newNode === "string") {
    if (oldNode !== newNode) {
      parentElement.childNodes[index].textContent = newNode;
    }
    return;
  }

  // 노드 타입이 같은 경우
  updateAttributes(
    parentElement.childNodes[index],
    newNode.props || {},
    oldNode.props || {},
  );

  // 자식 노드 재귀 업데이트
  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];
  const maxLength = Math.max(oldChildren.length, newChildren.length);

  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parentElement.childNodes[index],
      newChildren[i],
      oldChildren[i],
      i,
    );
  }
}
