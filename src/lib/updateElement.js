import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  if (!target) {
    return;
  }

  // 새 속성 추가 변경
  for (const key in originNewProps) {
    const newValue = originNewProps[key];
    const oldValue = originOldProps[key];

    if (newValue !== oldValue) {
      if (key.startsWith("on")) {
        // 이벤트 리스너 업데이트
        const eventType = key.slice(2).toLowerCase();
        removeEvent(target, eventType, oldValue);
        addEvent(target, eventType, newValue);
      } else if (key === "className") {
        target.className = newValue;
      } else {
        target.setAttribute(key, newValue);
      }
    }
  }
  // 삭제된 속성 변경
  for (const key in originOldProps) {
    const oldValue = originOldProps[key];
    if (!(key in originNewProps)) {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        removeEvent(target, eventType, oldValue);
      } else {
        target.removeAttribute(key);
      }
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!parentElement) return;
  if (!newNode && !oldNode) return;

  const existingNode = parentElement.childNodes[index];

  // 1. 노드 제거 (newNode가 없고 oldNode가 있는 경우)
  if (!newNode && oldNode) {
    parentElement.removeChild(existingNode);
    return;
  }

  // 2. 새 노드 추가 (newNode가 있고 oldNode가 없는 경우)
  if (newNode && !oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  // 3. 텍스트 노드 업데이트
  if (typeof newNode === "number" || typeof newNode === "string") {
    if (newNode !== oldNode) {
      parentElement.childNodes[index].textContent = newNode;
    }
    return;
  }

  // 4. 노드 교체 (newNode와 oldNode의 타입이 다른 경우)
  if (newNode.type !== oldNode.type) {
    const el = createElement(newNode);
    existingNode.replaceWith(el);
    return;
  }
  // 5. 같은 타입의 노드 업데이트
  //     - 속성 업데이트
  updateAttributes(existingNode, newNode.props || {}, oldNode.props || {});
  //     - 자식 노드 재귀적 업데이트
  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];

  const max = Math.max(newChildren.length, oldChildren.length);

  for (let i = 0; i < max; i++) {
    updateElement(existingNode, newChildren[i], oldChildren[i], i);
  }
}
