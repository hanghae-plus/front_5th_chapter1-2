import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";
import { extractEventKey, isEvent, getAttributeKey } from "../utils";

function updateAttributes(target, originNewProps, originOldProps) {
  const attributes = new Set([
    ...Object.keys(originNewProps),
    ...Object.keys(originOldProps),
  ]);

  attributes.forEach((key) => {
    const newPropValue = originNewProps[key];
    if (newPropValue === originOldProps[key]) {
      return;
    }

    if (isEvent(key)) {
      const eventKey = extractEventKey(key);
      removeEvent(target, eventKey);
      addEvent(target, eventKey, newPropValue);
    } else {
      const attributeKey = getAttributeKey(key);
      if (!attributeKey) {
        return;
      }

      if (newPropValue) {
        target.setAttribute(attributeKey, newPropValue);
      } else {
        target.removeAttribute(attributeKey);
      }
    }
  });
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!parentElement) {
    return;
  }

  if (!newNode && oldNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  if (newNode && !oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  const $el = parentElement.childNodes[index];

  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode !== oldNode) {
      $el.textContent = newNode;
    }
    return;
  }

  if (newNode.type !== oldNode.type) {
    $el.replaceWith(createElement(newNode));
    return;
  }

  if (newNode.type === oldNode.type) {
    updateAttributes($el, newNode.props || {}, oldNode.props || {});
  }

  const newNodeChildren = newNode.children || [];
  const oldNodeChildren = oldNode.children || [];

  if (
    newNodeChildren.every((child) => child.props?.key) &&
    oldNodeChildren.every((child) => child.props?.key)
  ) {
    updateChildrenWithKey($el, newNodeChildren, oldNodeChildren);
  } else {
    const maxLength = Math.max(newNodeChildren.length, oldNodeChildren.length);
    for (let i = 0; i < maxLength; i++) {
      updateElement($el, newNodeChildren[i], oldNodeChildren[i], i);
    }
  }
}

function updateChildrenWithKey(parentElement, newChildren, oldChildren) {
  // 1. 이전 children을 key로 매핑
  const oldKeyMap = new Map();
  oldChildren.forEach((child, index) => {
    if (child.props.key) {
      oldKeyMap.set(child.props.key, { node: child, index });
    }
  });

  // 2. newChildren에 대해 key를 확인하고 업데이트
  newChildren.forEach((newChild, newIndex) => {
    const key = newChild.props.key;

    // 2-1. 새로운 노드가 추가된 경우
    if (!oldKeyMap.has(key)) {
      const newEl = createElement(newChild);
      parentElement.insertBefore(
        newEl,
        parentElement.childNodes[newIndex] || null,
      );
    } else {
      // 2-2. 기존 노드가 업데이트된 경우
      const { node: oldChild, index: oldIndex } = oldKeyMap.get(key);
      const currentNode = parentElement.childNodes[oldIndex];
      if (oldIndex !== newIndex) {
        parentElement.insertBefore(
          currentNode,
          parentElement.childNodes[newIndex] || null,
        );
      }

      updateElement(parentElement, newChild, oldChild, newIndex);
      oldKeyMap.delete(key);
    }
  });

  // 2-3. 기존 노드가 삭제된 경우
  [...oldKeyMap.values()]
    .map(({ index }) => index)
    .sort((a, b) => b - a)
    .forEach((index) => {
      parentElement.removeChild(parentElement.childNodes[index]);
    });
}
