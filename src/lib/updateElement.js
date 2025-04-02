import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

/** 변경 props 및 이벤트 확인 후 재적용 */
function updateAttributes(target, originNewProps = {}, originOldProps = {}) {
  // 삭제된 속성 제거
  for (const key in originOldProps) {
    if (!(key in originNewProps)) {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        removeEvent(target, eventType);
      } else if (key === "className") {
        target.removeAttribute("class");
      } else {
        target.removeAttribute(key);
      }
    }
  }
  // 새 속성 추가 또는 변경
  for (const key in originNewProps) {
    const newVal = originNewProps[key];
    const oldVal = originOldProps[key];
    if (newVal !== oldVal) {
      if (key.startsWith("on") && typeof newVal === "function") {
        const eventType = key.slice(2).toLowerCase();
        addEvent(target, eventType, newVal);
      } else if (key === "className") {
        target.setAttribute("class", newVal);
      } else {
        target.setAttribute(key, newVal);
      }
    }
  }
}

/**
 * 두 노드 간 차이를 비교하고, 차이가 있는 부분을 업데이트 합니다.
 *
 * @param parentElement 비교 대상 노드들의 부모 요소
 * @param newNode 새로운 노드
 * @param oldNode 이전 노드
 * @param index 부모 요소로부터 몇번째 index에 해당하는 노드인가
 * */
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  /** 실제 DOM 요소 */
  const currentElement = parentElement.childNodes[index];

  // A. DOM 교체 필요
  // 1. 노드 추가
  if (!oldNode && newNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  // 2. 노드 삭제
  if (oldNode && !newNode) {
    parentElement.removeChild(currentElement);
    return;
  }

  // 3. 문자열 또는 숫자 비교 불일치
  if (
    typeof newNode === "string" ||
    typeof newNode === "number" ||
    typeof oldNode === "string" ||
    typeof oldNode === "number"
  ) {
    if (newNode !== oldNode) {
      parentElement.replaceChild(createElement(newNode), currentElement);
    }
    return;
  }

  // 4. 타입 불일치
  if (newNode.type !== oldNode.type) {
    parentElement.replaceChild(createElement(newNode), currentElement);
    return;
  }

  // B. DOM 교체 불필요, diff 비교 후 일부만 변경
  updateAttributes(currentElement, newNode.props || {}, oldNode.props || {});

  // 자식 모두 비교
  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];

  const max = Math.max(newChildren.length, oldChildren.length);
  for (let i = 0; i < max; i++) {
    updateElement(currentElement, newChildren[i], oldChildren[i], i);
  }
}
