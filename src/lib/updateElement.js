import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";
import { getAttributeName, getEventType, isEventAttribute } from "./utils.js";

// TODO: 로직 간소화 리팩토링 필요
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!parentElement) {
    throw new Error("updateElement: parentElement가 정의되어 있지 않습니다.");
  }

  if (!newNode) {
    removeChildAtIndex(parentElement, index);
    return;
  }
  if (!oldNode) {
    const newElement = createElement(newNode);
    parentElement.appendChild(newElement);
    return;
  }

  const currentElement = parentElement.childNodes[index];

  if (isNodeChanged(newNode, oldNode)) {
    const newElement = createElement(newNode);
    parentElement.replaceChild(newElement, currentElement);
    return;
  }
  if (isTextNode(newNode) && newNode !== oldNode) {
    const newTextElement = createElement(newNode);
    parentElement.replaceChild(newTextElement, currentElement);
    return;
  }

  updateSameNode(currentElement, newNode, oldNode);
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
  const propsKeys = Object.keys(oldProps);

  for (const key of propsKeys) {
    if (key in newProps) continue;

    if (isEventAttribute(key)) {
      const eventType = getEventType(key);
      removeEvent(target, eventType, oldProps[key]);
    } else {
      target.removeAttribute(getAttributeName(key));
    }
  }
}

function addNewAttributes(target, newProps = {}, oldProps = {}) {
  for (const key in newProps) {
    if (newProps[key] === oldProps[key]) continue;

    if (isEventAttribute(key)) {
      const eventType = getEventType(key);
      if (oldProps[key]) removeEvent(target, eventType, oldProps[key]);
      addEvent(target, eventType, newProps[key]);
    } else {
      target.setAttribute(getAttributeName(key), newProps[key]);
    }
  }
}
