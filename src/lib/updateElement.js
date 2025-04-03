import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

// newNode와 oldNode의 attribute를 비교하여 변경된 부분만 반영한다
function updateAttributes(target, newProps, oldProps) {
  // 달라지저나 추가된 props를 반영
  for (const [attr, value] of Object.entries(newProps)) {
    if (oldProps[attr] === newProps[attr]) continue;
    if (attr.startsWith("on") && typeof value === "function") {
      const eventType = attr.toLowerCase().slice(2);
      addEvent(target, eventType, value);
    } else {
      target.setAttribute(attr, value);
    }
  }

  // 없어진 props를 attribute에서 제거.
  for (const [attr, value] of Object.entries(oldProps)) {
    if (newProps[attr] !== undefined) continue;

    if (attr.startsWith("on") && typeof value === "function") {
      const eventType = attr.toLowerCase().slice(2);
      removeEvent(target, eventType, value);
    } else {
      target.removeAttribute(attr);
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // if (!parentElement) return;
  // 1. oldNode 만 있는 경우
  if (!newNode && oldNode) {
    // return parentElement.removeChild(parentElement.childNode[index]);
    if (parentElement.childNodes[index]) {
      return parentElement.removeChild(parentElement.childNodes[index]);
    }
    return;
  }

  // 2. newNode만 있는 경우
  if (newNode && !oldNode) {
    return parentElement.appendChild(createElement(newNode));
  }

  // 3.oldNode와 newNode 모두 text 타입일 경우
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode === oldNode) return;
    // return parentElement.replaceChild(
    //   createElement(newNode),
    //   parentElement.childNodes[index],
    // );
    if (parentElement.childNodes[index]) {
      return parentElement.replaceChild(
        createElement(newNode),
        parentElement.childNodes[index],
      );
    }
    return;
  }

  //4.oldNode와 newNode의 태그 이름(type)이 다를 경우
  if (newNode.type !== oldNode.type) {
    // return parentElement.replaceChild(
    //   createElement(newNode),
    //   parentElement.childNodes[index],
    // );
    if (parentElement.childNodes[index]) {
      return parentElement.replaceChild(
        createElement(newNode),
        parentElement.childNodes[index],
      );
    }
    return;
  }

  // 5.oldNode와 newNode의 태그 이름(type)이 같을 경우
  updateAttributes(
    parentElement.children[index],
    newNode.props || {},
    oldNode.props || {},
  );

  // 6. newNode와 oldNode의 모든 자식 태그를 순회하며 1~5 내용을 반복한다
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
