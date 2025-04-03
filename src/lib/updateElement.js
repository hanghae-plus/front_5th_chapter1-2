import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

/**
 * 요소의 속성과 이벤트 핸들러를 업데이트하는 함수
 * @param {HTMLElement} target - 업데이트할 대상 DOM 요소
 * @param {Object} originNewProps - 새로운 속성 객체
 * @param {Object} originOldProps - 이전 속성 객체
 */
function updateAttributes(target, originNewProps, originOldProps) {
  Object.keys({ ...originNewProps, ...originOldProps }).forEach((key) => {
    if (key.startsWith("on")) {
      const eventType = key.replace(/^on/, "").toLowerCase();
      const newHandler = originNewProps[key];
      const oldHandler = originOldProps[key];
      if (oldHandler && oldHandler !== newHandler) {
        // 이전 핸들러(oldHandler)가 있고, 새로운 핸들러와 다르면 제거
        removeEvent(target, eventType, oldHandler);
      }
      if (newHandler && oldHandler !== newHandler) {
        // 새로운 핸들러(newHandler)가 있고, 이전 핸들러가 변경되었으면 새로 등록
        addEvent(target, eventType, newHandler);
      }
    } else {
      const attr = key === "className" ? "class" : key;
      const newValue = originNewProps[key];
      const oldValue = originOldProps[key];
      if (!newValue) {
        target.removeAttribute(attr);
      } else if (newValue !== oldValue) {
        target.setAttribute(attr, newValue);
      }
    }
  });
}

/**
 * 이전 상태의 가상 노드와 새로운 상태의 가상 노드를 비교하여 실제 DOM을 변경
 * */
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // 1. 새롭게 렌더링할 노드가 없는 경우 (삭제)
  // - 가상 DOM 구조에서 특정 위치의 노드가 제거될 때
  // - 조건부 렌더링으로 컴포넌트/요소가 사라질 떄
  if (!newNode) {
    // 부모 요소의 자식 노드 배열에서 특정 인덱스의 노드 선택해서 제거
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  // 2. 기존 노드가 없는 경우 (추가)
  if (!oldNode) {
    const newElement = createElement(newNode);
    parentElement.appendChild(newElement);
    return newElement;
  }

  // 3. 노드 타입이 다른 경우 (대체)
  if (typeof newNode !== typeof oldNode) {
    const newElement = createElement(newNode);
    // 기존 노드를 완전히 새로운 노드로 대체하고 이전 노드의 모든 특성 제거
    parentElement.replaceChild(newElement, parentElement.childNodes[index]);
    return;
  }

  // 4. 텍스트 노드인 경우
  if (typeof newNode === "string" || typeof newNode === "number") {
    const currentNode = parentElement.childNodes[index];
    if (currentNode.nodeValue !== newNode) {
      // 텍스트 내용이 변경된 경우 textContent만 업데이트
      currentNode.nodeValue = newNode;
    }
    return;
  }

  // 5. 요소 노드인 경우
  if (typeof newNode === "object") {
    const element = parentElement.childNodes[index];

    // 요소 타입(tag) 비교
    if (newNode.type !== oldNode.type) {
      const newElement = createElement(newNode);
      parentElement.replaceChild(newElement, element);
      return;
    }

    // 요소의 속성 및 이벤트 핸들러 업데이트
    updateAttributes(element, newNode.props || {}, oldNode.props || {});

    // 자식 노드 재귀적으로 업데이트
    const oldChildren = oldNode.children || [];
    const newChildren = newNode.children || [];
    const maxLength = Math.max(oldChildren.length, newChildren.length);

    // 가장 긴 자식 노드 배열 기준으로 순회
    // 노드 추가 시 추가된 노드까지 처리하고 노드 제거 시 제거된 노드까지 순회할 수 있기 때문에 모든 자식 도드의 변경 사항을 처리 가능함
    for (let i = 0; i < maxLength; i++) {
      updateElement(element, newChildren[i], oldChildren[i], i);
    }
    return;
  }

  return;
}
