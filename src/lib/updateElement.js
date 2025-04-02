import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";


/**
 *  newNode와 oldNode의 attribute를 비교하여 변경된 부분만 반영
 * @param target
 * @param originNewProps
 * @param originOldProps
 */
function updateAttributes(target, originNewProps, originOldProps) {
  Object.entries(originOldProps).forEach(([key, value]) => {
    // oldProps 이벤트 삭제
    if (key.startsWith("on") && typeof value === "function") {
      const eventName = key.slice(2).toLowerCase();
      removeEvent(target, eventName, value);
    }
  });

  const setAttributes = ([key, value]) => {
    // className -> class 매핑
    if (key === "className") key = "class";
    // newProps 이벤트 등록
    if (key.startsWith("on") && typeof value === "function") {
      const eventName = key.slice(2).toLowerCase();
      addEvent(target, eventName, value);
    } else if (typeof value === "object") {
      // ex. style: { color: 'red', fontSize: '16px' }
      Object.entries(value).forEach(setAttributes);
    } else {
      target.setAttribute(key, value);
    }
  }

  Object.entries(originNewProps).forEach(setAttributes);
}

/**
 * newNode, oldNode를 비교해서 변한 부분만 update
 * @param parentElement
 * @param newNode
 * @param oldNode
 * @param index
 */
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  const origin = parentElement.childNodes[index];
  if (!newNode && oldNode) {
    // 옛것만 존재 -> 제거
    parentElement.removeChild(origin);
    return;
  }
  if (newNode && !oldNode) {
    // 새것만 존재 -> append
    parentElement.appendChild(createElement(newNode));
    return;
  }

  if (typeof newNode === 'string' && typeof oldNode === 'string') {
    if (newNode !== oldNode) {
      origin.textContent = newNode;
      // parentElement.replaceChild(
      //   createElement(newNode),
      //   createElement(oldNode),
      // )
    }
    return;
  }

  if (newNode.type !== oldNode.type) {
    parentElement.replaceChild(createElement(newNode), origin);
    return;
  }

  updateAttributes(origin, newNode.props || {}, oldNode.props || {});

  // 자식 노드들 순회하며 updateElement
  const length = Math.max(newNode.children.length, oldNode.children.length);
  for (let i = 0; i < length; i++) {
    updateElement(
      origin,
      newNode.children?.[i],
      oldNode.children?.[i],
      i
    );
  }
}
