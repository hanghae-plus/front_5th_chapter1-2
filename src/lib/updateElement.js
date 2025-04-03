import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  const newProps = originNewProps || {};
  const oldProps = originOldProps || {};

  Object.keys(newProps).forEach((key) => {
    const newProp = newProps[key];
    const oldProp = oldProps[key];
    if (newProp !== oldProp) {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();

        if (oldProp) {
          removeEvent(target, eventType, oldProp);
        }

        if (newProp) {
          addEvent(target, eventType, newProp);
        }
      } else if (key === "className") {
        target.className = newProp;
      } else {
        target.setAttribute(key, newProp);
      }
    }
  });

  Object.keys(oldProps).forEach((key) => {
    const oldProp = oldProps[key];
    if (!newProps[key]) {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        removeEvent(target, eventType, oldProp);
      }
    }
  });
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  const target = parentElement.childNodes[index];
  // 1. 새로운 노드가 없다면 기존 노드 제거.
  if (!newNode) {
    if (target) parentElement.removeChild(target);
    return;
  }

  // 2. 기존 노드가 없다면 새로운 노드 추가.
  if (!oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  // 3. 타입이 다르다면 교체.
  if (newNode.type !== oldNode.type) {
    parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
    return;
  }

  // 4. 텍스트 노드인 경우 텍스트 업데이트.
  if (typeof newNode === "string" || typeof oldNode === "string") {
    if (newNode !== oldNode) {
      parentElement.replaceChild(
        document.createTextNode(newNode),
        parentElement.childNodes[index],
      );
    }
    return;
  }

  // 5. 타입이 같다면 속성 업데이트.
  if (newNode.type === oldNode.type) {
    updateAttributes(
      parentElement.childNodes[index],
      newNode.props,
      oldNode.props,
    );
  }

  const childLength = Math.max(
    newNode.children.length,
    oldNode.children.length,
  );

  for (let i = 0; i < childLength; i++) {
    updateElement(
      parentElement.children[index],
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}
