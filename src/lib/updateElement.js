import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  for (let [attr, value] of Object.entries(originNewProps)) {
    if (originOldProps[attr] === originNewProps[attr]) continue;

    if (attr.startsWith("on") && typeof originNewProps[attr] === "function") {
      // onClick -> click on이름 제거
      const eventType = attr.slice(2).toLowerCase();

      // onEvent가 먼저 등록되어있으면 제거
      if (typeof originOldProps[attr] === "function") {
        removeEvent(target, eventType, originOldProps[attr]);
      }

      addEvent(target, eventType, originNewProps[attr]);
      continue;
    }

    if (attr === "className") {
      attr = attr.replace("className", "class");
    }

    target.setAttribute(attr, value);
  }

  for (const attr of Object.keys(originOldProps)) {
    // old노드에서 새노드랑 비교해서 undefined가 아니면 아직 필요한 요소이므로 계속 불필요한 요소 찾기
    if (originNewProps[attr] !== undefined) continue;

    // 불필요한 요소 정리
    if (attr.startsWith("on")) {
      // onClick -> click on이름 제거
      const eventType = attr.slice(2).toLowerCase();
      removeEvent(target, eventType, originOldProps[attr]);
    }

    target.removeAttribute(attr);
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!parentElement) return;

  const existingChildNode = parentElement.childNodes[index];

  // 새로운 노드가 없고 기존 노드가 있으면 기존 노드를 제거 (새로 노드 생성하려고)
  if (!newNode && oldNode) {
    parentElement.removeChild(existingChildNode);
    return;
  }

  if (newNode && !oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode === oldNode) return;
    parentElement.replaceChild(createElement(newNode), existingChildNode);
    return;
  }

  if (newNode.type !== oldNode.type) {
    parentElement.replaceChild(createElement(newNode), existingChildNode);
    return;
  }

  updateAttributes(
    existingChildNode,
    newNode?.props || {},
    oldNode?.props || {},
  );

  const maxLength = Math.max(
    newNode.children?.length || 0,
    oldNode.children?.length || 0,
  );

  for (let i = 0; i < maxLength; i++) {
    updateElement(
      existingChildNode,
      newNode?.children[i],
      oldNode?.children[i],
      i,
    );
  }
}
