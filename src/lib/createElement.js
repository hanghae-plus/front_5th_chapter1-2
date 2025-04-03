import { isArray, isFalsy, isPrimitive } from "../utils/typeCheck";
import { addEvent } from "./eventManager";

/**
 * 가상 DOM 노드를 실제 DOM 요소로 변환하는 함수
 * @param {Object} vNode - 정규화된(normalizeVNode) 가상 DOM 노드
 */
export function createElement(vNode) {
  // 1. falsy 값 처리 (undefined, null, false, true) - 빈 노드 반환
  if (isFalsy(vNode)) {
    return document.createTextNode("");
  }

  // 2. 문자열과 숫자는 문자열로 변환되어야 한다.
  if (isPrimitive(vNode)) {
    return document.createTextNode(String(vNode));
  }

  // 3. 배열이면 DocumentFragment 생성 - 자식은 재귀 호출
  if (isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      if (!child) return;
      const childEl = createElement(child);
      if (childEl) fragment.appendChild(childEl);
    });
    return fragment;
  }

  // 가상돔 형태의 경우
  if (vNode.type) {
    const element = document.createElement(vNode.type);

    // props 처리 - 이벤트 등
    if (vNode.props) {
      updateAttributes(element, vNode.props);
    }

    // children 처리 - 자식 노드들의 배열
    if (vNode.children) {
      vNode.children.forEach((child) => {
        if (!child) return; // null 체크 추가
        const childElement = createElement(child);
        if (childElement) element.appendChild(childElement);
      });
    }

    return element;
  }
  return vNode;
}

function updateAttributes($el, props) {
  Object.entries(props).forEach(([key, value]) => {
    // 이벤트 핸들러 처리
    if (key.startsWith("on")) {
      const eventType = key.toLowerCase().slice(2);
      addEvent($el, eventType, value);
      return;
    }

    // className 처리
    if (key === "className") {
      $el.setAttribute("class", value);
      return;
    }

    // 일반 속성 처리
    $el.setAttribute(key, value);
  });
}
