import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(targetEl, newProps = {}, oldProps = {}) {
  // 삭제된 속성 제거
  for (const key in oldProps) {
    if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      removeEvent(targetEl, eventType, oldProps[key]);
    } else if (!(key in newProps)) {
      targetEl.removeAttribute(key);
    }
  }

  // 새로 추가되거나 변경된 속성 적용
  for (const key in newProps) {
    const value = newProps[key];
    if (key === "className") {
      targetEl.setAttribute("class", value);
    } else if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      addEvent(targetEl, eventType, value);
    } else {
      targetEl.setAttribute(key, value);
    }
  }
}

export function updateElement(parentEl, newVNode, oldVNode, index = 0) {
  const currentEl = parentEl.childNodes[index];

  // 새 노드만 있는 경우
  if (newVNode && !oldVNode) {
    const newEl = createElement(newVNode);
    parentEl.appendChild(newEl);
    return;
  }

  // 기존 노드만 있는 경우
  if (!newVNode && oldVNode) {
    parentEl.removeChild(currentEl);
    return;
  }

  // 텍스트 노드 변경
  if (typeof newVNode === "string" && typeof oldVNode === "string") {
    if (newVNode !== oldVNode) {
      const textEl = createElement(newVNode);
      parentEl.replaceChild(textEl, currentEl);
    }
    return;
  }

  // 노드 타입이 다르면 교체
  if (newVNode.type !== oldVNode.type) {
    const replacedEl = createElement(newVNode);
    parentEl.replaceChild(replacedEl, currentEl);
    return;
  }

  // 동일 타입이면 속성만 갱신
  updateAttributes(currentEl, newVNode.props, oldVNode.props);

  // 자식 노드 재귀적으로 diff
  const newChildren = newVNode.children || [];
  const oldChildren = oldVNode.children || [];
  const maxLen = Math.max(newChildren.length, oldChildren.length);

  for (let i = 0; i < maxLen; i++) {
    updateElement(currentEl, newChildren[i], oldChildren[i], i);
  }
}
