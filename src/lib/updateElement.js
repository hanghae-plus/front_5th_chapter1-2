import { extractEventTypeFromKey } from "../utils/eventUtils";
import { createElement } from "./createElement";
import { addEvent, removeEvent } from "./eventManager";

function updateAttributes(target, originNewProps, originOldProps) {
  const newProps = originNewProps ?? {};
  const oldProps = originOldProps ?? {};

  Object.entries(newProps).forEach(([key, value]) => {
    if (key === "className") {
      target.setAttribute("class", value);
    } else if (key.startsWith("on")) {
      const eventType = extractEventTypeFromKey(key);
      addEvent(target, eventType, value);
    } else {
      target.setAttribute(key, value);
    }
  });

  Object.keys(oldProps)
    .filter((key) => !(key in newProps))
    .forEach((key) => {
      if (key.startsWith("on")) {
        const eventName = extractEventTypeFromKey(key);
        removeEvent(target, eventName);
      } else {
        target.removeAttribute(key);
      }
    });
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // parentNode 가 없다면 return
  if (!parentElement) return;
  // 노드 제거(!newNode && oldNode)
  if (!newNode && oldNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }
  // 새 노드 추가
  if (newNode && !oldNode) {
    const $el = createElement(newNode);
    parentElement.appendChild($el);
    return;
  }
  // 텍스트 노드 업데이트
  if (typeof newNode === "string" && typeof oldNode === "string") {
    parentElement.childNodes[index].textContent = newNode;
  }
  // 노드 교체(newNode && oldNode)
  if (newNode.type !== !oldNode.type) {
    const $el = createElement(newNode);
    parentElement.childNodes[index].replaceWith($el);
  }
  // 노드 타입 업데이트
  updateAttributes(
    parentElement.childNodes[index],
    oldNode.props,
    newNode.props,
  );

  // 자식노드 재귀
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
