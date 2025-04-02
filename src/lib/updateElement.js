import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  // 달라지거나 추가된 Props를 반영
  for (const [attr, value] of Object.entries(originNewProps)) {
    if (originOldProps[attr] === originNewProps[attr]) continue;

    if (/^on[A-Z]/.test(attr)) {
      const eventType = attr.slice(2).toLowerCase();
      if (typeof originNewProps[attr] === "function") {
        removeEvent(target, eventType, originOldProps[attr]);
      }
      if (typeof value === "function") {
        addEvent(target, eventType, value);
      }
      continue;
    }
    // className → class 변환
    if (attr === "className") {
      target.setAttribute("class", value);
    } else {
      target.setAttribute(attr, value);
    }
  }

  // 없어진 props를 attribute에서 제거
  for (const attr of Object.keys(originOldProps)) {
    if (originNewProps[attr] !== undefined) continue;

    if (/^on[A-Z]/.test(attr)) {
      const eventType = attr.slice(2).toLowerCase();
      if (typeof originOldProps[attr] === "function") {
        removeEvent(target, eventType, originOldProps[attr]);
      }
      continue;
    }
    if (attr === "className") {
      target.removeAttribute("class");
    } else {
      target.removeAttribute(attr);
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!parentElement) {
    return;
  }
  // 1. oldNode만 있는 경우
  if (!newNode && oldNode) {
    return parentElement.removeChild(parentElement.childNodes[index]);
  }

  // 2. newNode만 있는 경우
  if (newNode && !oldNode) {
    return parentElement.appendChild(createElement(newNode));
  }

  // 3. oldNode와 newNode 모두 text 타입일 경우
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode === oldNode) {
      return;
    }
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  // 4. oldNode와 newNode의 태그 이름(type)이 다를 경우
  if (newNode.type !== oldNode.type) {
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  // 5. oldNode와 newNode의 태그 이름(type)이 같을 경우
  updateAttributes(
    parentElement.childNodes[index],
    newNode.props || {},
    oldNode.props || {},
  );

  // 6. newNode와 oldNode의 모든 자식 태그를 순회하며 1 ~ 5의 내용을 반복한다.
  const maxLength = Math.max(newNode.children.length, oldNode.children.length);
  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parentElement.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}
