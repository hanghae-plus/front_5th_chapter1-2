import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

/**
 * 요소의 속성과 이벤트 핸들러를 업데이트하는 함수
 * @param {HTMLElement} target - 업데이트할 대상 DOM 요소
 * @param {Object} originNewProps - 새로운 속성 객체
 * @param {Object} originOldProps - 이전 속성 객체
 */
function updateAttributes(target, originNewProps, originOldProps) {
  // 1. 이벤트 핸들러 처리
  // 1.1 이전 이벤트 핸들러 제거
  Object.keys(originOldProps)
    .filter((key) => key.startsWith("on"))
    .forEach((key) => {
      // 새 props에 해당 핸들러가 없거나 다른 핸들러로 변경된 경우
      if (
        !(key in originNewProps) ||
        originOldProps[key] !== originNewProps[key]
      ) {
        const eventType = key.replace(/^on/, "").toLowerCase();
        removeEvent(target, eventType, originOldProps[key]);
      }
    });

  // 1.2 새 이벤트 핸들러 추가
  Object.keys(originNewProps)
    .filter((key) => key.startsWith("on"))
    .forEach((key) => {
      // 이전 props에 해당 핸들러가 없거나 다른 핸들러였던 경우
      if (
        !(key in originOldProps) ||
        originOldProps[key] !== originNewProps[key]
      ) {
        const eventType = key.replace(/^on/, "").toLowerCase();
        addEvent(target, eventType, originNewProps[key]);
      }
    });

  // 2. 일반 속성 처리
  // 2.1 제거된 속성 처리
  Object.keys(originOldProps)
    .filter((key) => !key.startsWith("on"))
    .forEach((key) => {
      // 새 props에 해당 속성이 없는 경우
      if (!(key in originNewProps)) {
        target.removeAttribute(key);
      }
    });

  // 2.2 새 속성 추가 및 변경된 속성 업데이트
  Object.keys(originNewProps)
    .filter((key) => !key.startsWith("on"))
    .forEach((key) => {
      // className은 class로 변환
      const attr = key === "className" ? "class" : key;

      // 이전 props와 값이 다른 경우
      if (originOldProps[key] !== originNewProps[key]) {
        target.setAttribute(attr, originNewProps[key]);
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
    return null;
  }

  // 2. 기존 노드가 없는 경우 (추가)
  if (!oldNode) {
    const newElement = createElement(newNode);
    newElement.__vNode = newNode; // vNode 정보 저장
    parentElement.insertBefore(
      newElement,
      parentElement.childNodes[index] || null,
    );
    return newElement;
  }

  // 3. 노드 타입이 다른 경우 (대체)
  if (typeof newNode !== typeof oldNode) {
    const newElement = createElement(newNode);
    // 기존 노드를 완전히 새로운 노드로 대체하고 이전 노드의 모든 특성 제거
    parentElement.replaceChild(newElement, parentElement.childNodes[index]);
    return newElement;
  }

  // 4. 텍스트 노드인 경우
  if (typeof newNode === "string" || typeof newNode === "number") {
    const currentNode = parentElement.childNodes[index];
    if (currentNode.nodeValue !== newNode) {
      // 텍스트 내용이 변경된 경우 textContent만 업데이트
      currentNode.nodeValue = newNode;
    }
    return currentNode;
  }

  // 5. 요소 노드인 경우
  if (typeof newNode === "object") {
    const element = parentElement.childNodes[index];

    // 요소 타입(tag) 비교
    if (newNode.type !== oldNode.type) {
      const newElement = createElement(newNode);

      parentElement.replaceChild(newElement, parentElement.childNodes[index]);
      return newElement;
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
    return element;
  }

  return null;
}
