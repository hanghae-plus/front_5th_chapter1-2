import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!parentElement) {
    throw new Error("updateElement: parentElement가 정의되어 있지 않습니다.");
  }
  if (!newNode) {
    removeChildAtIndex(parentElement, index);
    return;
  }

  if (!oldNode) {
    const element = createElement(newNode);
    parentElement.appendChild(element);
    return;
  }

  if (isNodeChanged(newNode, oldNode)) {
    const newElement = createElement(newNode);
    const oldElement = parentElement.childNodes[index];

    parentElement.replaceChild(newElement, oldElement);
    return;
  }

  if (isTextNode(newNode) && newNode !== oldNode) {
    const newTextElement = document.createTextNode(newNode);
    const oldTextElement = parentElement.childNodes[index];

    parentElement.replaceChild(newTextElement, oldTextElement);
    return;
  }

  updateSameNode(parentElement.childNodes[index], newNode, oldNode);
}

/** 부모 요소의 자식 노드 중 index 위치의 노드를 제거 */
function removeChildAtIndex(parent, index) {
  const child = parent.childNodes[index];

  if (child) parent.removeChild(child);
}

/**
 * 두 노드가 다른지 여부를 판별
 * - 케이스1: 노드의 타입이 다를 경우
 * - 케이스2: 텍스트 노드인데, 내용이 다를 경우
 * - 케이스3: 일반 엘리먼트의 경우 태그(type)가 다르면 변경된 것으로 간주
 */
function isNodeChanged(newNode, oldNode) {
  if (typeof newNode !== typeof oldNode) return true;
  else if (isTextNode(newNode, oldNode) && newNode !== oldNode) return true;
  else if (newNode.type !== oldNode.type) return true;
  else return false;
}

function isTextNode(newNode, oldNode) {
  return typeof newNode === "string" || typeof oldNode === "string";
}

/** 같은 노드일 경우, DOM 요소(targetElement)의 속성과 자식 노드를 업데이트 */
function updateSameNode(targetElement, newNode, oldNode) {
  updateAttributes(targetElement, newNode.props || {}, oldNode.props || {});
  updateChildren(targetElement, newNode.children || [], oldNode.children || []);
}

/** 자식 노드를 업데이트 (newChildren와 oldChildren의 최대 길이만큼 재귀 호출) */
function updateChildren(parent, newChildren, oldChildren) {
  const maxLength = Math.max(newChildren.length, oldChildren.length);

  for (let i = 0; i < maxLength; i++) {
    /** updateElement: i는 자식을 재귀적으로 업데이트할 때 사용 */
    updateElement(parent, newChildren[i], oldChildren[i], i);
  }
}

/** DOM 요소(target)의 속성을 새 props와 이전 props를 비교하여 업데이트(props, event, attribute) */
function updateAttributes(target, newProps = {}, oldProps = {}) {
  removeOldAttributes(target, newProps, oldProps);
  addNewAttributes(target, newProps, oldProps);
}

function removeOldAttributes(target, newProps = {}, oldProps = {}) {
  for (const key in oldProps) {
    if (!(key in newProps)) {
      if (key === "className") {
        target.removeAttribute("class");
      } else if (key.startsWith("on")) {
        const eventType = key.toLowerCase().substring(2);
        removeEvent(target, eventType, oldProps[key]);
      } else {
        target.removeAttribute(key);
      }
    }
  }
}

function addNewAttributes(target, newProps = {}, oldProps = {}) {
  for (const key in newProps) {
    if (newProps[key] !== oldProps[key]) {
      if (key === "className") {
        target.setAttribute("class", newProps[key]);
      } else if (key.startsWith("on")) {
        const eventType = key.toLowerCase().substring(2);
        if (oldProps[key]) {
          removeEvent(target, eventType, oldProps[key]);
        }
        addEvent(target, eventType, newProps[key]);
      } else {
        target.setAttribute(key, newProps[key]);
      }
    }
  }
}
