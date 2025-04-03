import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

/**
 * 속성 업데이트
 * @param {*} target
 * @param {*} originNewProps
 * @param {*} originOldProps
 * @returns 업데이트된 요소
 */
function updateAttributes(target, originNewProps, originOldProps) {
  const props = { ...(originOldProps || {}), ...(originNewProps || {}) };

  // 모든 속성을 순회하며 변경점 확인
  Object.keys(props).forEach((name) => {
    // 이벤트 핸들러 처리
    if (name.startsWith("on") && typeof props[name] === "function") {
      const eventType = name.toLowerCase().substring(2);

      // 이전 핸들러 제거 (있는 경우)
      if (originOldProps && typeof originOldProps[name] === "function") {
        removeEvent(target, eventType, originOldProps[name]);
      }

      // 새 핸들러 추가 (있는 경우)
      if (originNewProps && typeof originNewProps[name] === "function") {
        addEvent(target, eventType, originNewProps[name]);
      }
    }
    // 일반 속성 처리
    else if (name !== "children" && name !== "key") {
      // className 처리
      if (name === "className") {
        if (originNewProps && originNewProps[name] !== undefined) {
          target.setAttribute("class", originNewProps[name]);
        } else {
          target.removeAttribute("class");
        }
      }
      // 새 속성이 없거나 false면 속성 제거
      else if (
        !originNewProps ||
        originNewProps[name] === false ||
        originNewProps[name] === null ||
        originNewProps[name] === undefined
      ) {
        target.removeAttribute(name);
      }
      // 속성이 true면 빈 문자열로 설정
      else if (originNewProps[name] === true) {
        target.setAttribute(name, "");
      }
      // 일반 값은 그대로 설정
      else {
        target.setAttribute(name, originNewProps[name]);
      }
    }
  });
}

/**
 * 가상 DOM 비교 알고리즘
 * Diffing 기본 구현
 * @param {*} parentElement 부모 요소
 * @param {*} newNode 새로운 노드
 * @param {*} oldNode 이전 노드
 * @param {*} index 인덱스
 * @returns 업데이트된 요소
 */
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // 1. 기본 노드 추가 삭제
  // 이전 노드가 없는 경우 (새로운 노드 추가)
  if (oldNode === undefined || oldNode === null) {
    // 새 노드만 있으면 추가
    if (newNode) {
      parentElement.appendChild(createElement(newNode));
    }
    return;
  }

  // 새로운 노드가 없는 경우 (노드 삭제)
  if (newNode === undefined || newNode === null) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  // 2. 텍스트 노드 비교
  if (
    typeof newNode === "string" ||
    typeof newNode === "number" ||
    typeof oldNode === "string" ||
    typeof oldNode === "number"
  ) {
    // 텍스트가 다르면 교체
    if (newNode !== oldNode) {
      const newTextNode = createElement(newNode);
      parentElement.replaceChild(newTextNode, parentElement.childNodes[index]);
    }
    return;
  }

  // 3. 노드 타입이 다르면 완전히 교체
  if (newNode.type !== oldNode.type) {
    const newElement = createElement(newNode);
    parentElement.replaceChild(newElement, parentElement.childNodes[index]);
    return;
  }

  // 4. 같은 타입의 노드면 속성만 업데이트
  updateAttributes(
    parentElement.childNodes[index],
    newNode.props,
    oldNode.props,
  );

  // 5.자식 노드 비교...
  const newLength = newNode.children ? newNode.children.length : 0;
  const oldLength = oldNode.children ? oldNode.children.length : 0;
  const maxLength = Math.max(newLength, oldLength);

  // 모든 자식 순회하며 재귀적 업데이트
  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parentElement.childNodes[index],
      newNode.children && i < newLength ? newNode.children[i] : null,
      oldNode.children && i < oldLength ? oldNode.children[i] : null,
      i,
    );
  }
}
