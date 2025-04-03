import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";
import { normalizeAttribute } from "../utils/index.js";

/**
 * @description 업데이트된 속성을 적용하여 요소의 속성을 갱신
 * @param {HTMLElement} target - 속성을 변경할 대상 요소
 * @param {Object} originNewProps - 새로운 속성 객체
 * @param {Object} originOldProps - 기존 속성 객체
 */
function updateAttributes(target, originNewProps, originOldProps) {
  for (const [attr, value] of Object.entries(originNewProps)) {
    if (originOldProps[attr] === value) {
      continue; // 기존 값과 동일하면 패스
    }

    if (attr.startsWith("on")) {
      // 이벤트 속성 처리
      const eventType = attr.slice(2).toLowerCase();
      removeEvent(target, eventType, originOldProps[attr]);
      addEvent(target, eventType, value);
    } else {
      target.setAttribute(normalizeAttribute(attr), value); // 일반
    }
  }

  for (const attr of Object.keys(originOldProps)) {
    if (!(attr in originNewProps)) {
      if (attr.startsWith("on")) {
        // 제거할 이벤트 속성 처리
        const eventType = attr.slice(2).toLowerCase();
        removeEvent(target, eventType, originOldProps[attr]);
      } else {
        // 제거할 일반 속성 처리
        target.removeAttribute(normalizeAttribute(attr));
      }
    }
  }
}

/**
 * @description 새로운 가상 DOM과 기존 가상 DOM을 비교하여 실제 DOM을 업데이트
 * @param {HTMLElement} parentElement - 업데이트할 부모 요소
 * @param {*} newNode - 새로운 가상 DOM 노드
 * @param {*} oldNode - 기존 가상 DOM 노드
 * @param {number} index [index=0] - 업데이트할 자식 노드의 인덱스
 */
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // if (!parentElement) return;

  // // childNodes[index]가 존재하는지 확인
  // if (!parentElement.childNodes[index] && oldNode) return;

  // 새로온 노드가 없고 기존 노드만 존재하면 삭제
  if (!newNode && oldNode) {
    return parentElement.removeChild(parentElement.childNodes[index]);
  }

  // 기존 노드가 없고 새로운 노드만 존재하면 추가
  if (newNode && !oldNode) {
    return parentElement.appendChild(createElement(newNode));
  }

  if (typeof newNode === "string" && typeof oldNode === "string") {
    // 텍스트 노드가 변경되었을 경우 교체
    if (newNode !== oldNode) {
      parentElement.replaceChild(
        createElement(newNode),
        parentElement.childNodes[index],
      );
    }
    return;
  }

  if (newNode.type !== oldNode.type) {
    // 노드 타입이 다르면 교체
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  // childNodes[index]가 존재하는지 다시 확인 (안전성 확보)
  if (!parentElement.childNodes[index]) return;

  // 속성 업데이트
  updateAttributes(
    parentElement.childNodes[index],
    newNode.props || {},
    oldNode.props || {},
  );

  // 자식 노드 개수 비교 후 업데이트 수행
  const maxLength = Math.max(newNode.children.length, oldNode.children.length);

  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parentElement.childNodes[index],
      newNode.children?.[i],
      oldNode.children?.[i],
      i,
    );
  }
}
