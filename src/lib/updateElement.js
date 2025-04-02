import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";
import { getEventType, isAttrEventHandler } from "../utils";
/**
 * 속성 업데이트
 * @param {*} target 대상 요소
 * @param {*} originNewProps 새로운 속성
 * @param {*} originOldProps 이전 속성
 */
function updateAttributes(target, originNewProps, originOldProps) {
  // 제거된 속성 처리
  for (const attr of Object.keys(originOldProps)) {
    if (originNewProps[attr] !== undefined) continue;

    if (isAttrEventHandler(attr, originOldProps[attr])) {
      const eventType = getEventType(attr);
      removeEvent(target, eventType, originOldProps[attr]);
      continue;
    }

    if (attr === "className") {
      target.removeAttribute("class");
      continue;
    }

    target.removeAttribute(attr);
    continue;
  }

  // 속성 업데이트
  for (const [attr, value] of Object.entries(originNewProps)) {
    // 이미 같은 값이면 처리하지 않음
    if (originOldProps[attr] === value) continue;

    // 이벤트 핸들러 처리
    if (isAttrEventHandler(attr, value)) {
      const eventType = getEventType(attr);
      if (originOldProps[attr]) {
        removeEvent(target, eventType, originOldProps[attr]);
      }
      addEvent(target, eventType, value);
      continue;
    }

    // className을 class로 변환
    if (attr === "className") {
      target.setAttribute("class", value);
      continue;
    }

    // 일반 속성 처리
    target.setAttribute(attr, value);
  }
}

/**
 * 요소 업데이트
 * @param {*} parentElement 부모 요소
 * @param {*} newNode 새로운 요소
 * @param {*} oldNode 이전 요소
 * @param {*} index 인덱스
 */
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // 노드가 제거된 경우
  if (!newNode && oldNode) {
    return parentElement.removeChild(parentElement.childNodes[index]);
  }

  // 새로운 노드가 추가된 경우
  if (newNode && !oldNode) {
    return parentElement.appendChild(createElement(newNode));
  }

  // 텍스트 노드인 경우 텍스트 노드를 업데이트
  if (typeof newNode === "string") {
    const textNode = parentElement.childNodes[index];
    if (textNode.nodeType === Node.TEXT_NODE) {
      if (textNode.textContent !== newNode) textNode.textContent = newNode;
      return;
    }

    parentElement.replaceChild(document.createTextNode(newNode), textNode);
    return;
  }

  // 노드 타입이 변경된 경우 새로운 노드를 생성하여 교체
  if (newNode.type !== oldNode.type) {
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  // 속성 업데이트
  updateAttributes(
    parentElement.childNodes[index],
    newNode.props || {},
    oldNode.props || {},
  );

  // 자식 노드 업데이트
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
