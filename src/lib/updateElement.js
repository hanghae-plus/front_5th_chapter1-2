import { addEvent, removeEvent } from "./eventManager";

import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  if (!target) return;
  const newProps = originNewProps || {};
  const oldProps = originOldProps || {};

  // 새로운 속성 추가 + 기존 속성 업데이트
  Object.entries(newProps).forEach(([key, value]) => {
    if (key === "className") {
      target.setAttribute("class", value);
    } else if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
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
        const eventName = key.slice(2).toLowerCase();
        removeEvent(target, eventName);
      } else {
        target.removeAttribute(key);
      }
    });
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!parentElement) return;
  if (!newNode && !oldNode) return;

  // 노드 제거 (newNode가 없고 oldNode가 있는 경우)
  if (!newNode && oldNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  // 새 노드 추가 (newNode가 있고 oldNode가 없는 경우)
  if (newNode && !oldNode) {
    const el = createElement(newNode);
    parentElement.appendChild(el);
    return;
  }

  // 텍스트 노드 업데이트
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode !== oldNode) {
      parentElement.childNodes[index].textContent = newNode;
    }
  }

  // 노드 교체 (newNode와 oldNode의 타입이 다른 경우)
  if (newNode.type !== oldNode.type) {
    const el = createElement(newNode);
    parentElement.childNodes[index].replaceWith(el);
    return;
  }

  // 같은 타입의 노드 업데이트
  // 속성 업데이트, 자식 노드 재귀적 업데이트, 불필요한 자식 노드 제거
  updateAttributes(
    parentElement.childNodes[index],
    newNode.props,
    oldNode.props,
  );

  // 자식 노드 재귀적 업데이트
  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];
  const maxLength = Math.max(newChildren.length, oldChildren.length);
  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parentElement.childNodes[index],
      newChildren[i],
      oldChildren[i],
      i,
    );
  }
}
