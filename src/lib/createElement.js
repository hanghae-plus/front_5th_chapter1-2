import { addEvent } from "./eventManager";

/**
 * 정규화된 vNode를 실제 DOM 요소로 변환
 * @param {*} vNode 변환할 정규화된 vNode
 * @returns {Element} 변환 완료된 DOM 요소
 */
export function createElement(vNode) {
  const _applyProps = (element, props) => {
    Object.entries(props).forEach(([key, value]) => {
      if (key.startsWith("on") && typeof value === "function") {
        // 이벤트 핸들러 처리
        const eventName = key.toLowerCase().substring(2);
        addEvent(element, eventName, value);
      } else if (key === "className") {
        // className 특수 케이스
        element.setAttribute("class", value);
      } else {
        // 일반 속성
        element.setAttribute(key, value);
      }
    });
  };

  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  // vNode가 배열인 경우, 배열의 각 요소를 재귀적으로 변환하여 생성
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      const childElement = createElement(child);
      fragment.appendChild(childElement);
    });
    return fragment;
  }

  // vNode.type에 해당하는 요소 생성
  const element = document.createElement(vNode.type);

  // props 적용
  if (vNode.props) _applyProps(element, vNode.props);

  // 자식 요소 추가
  if (vNode.children) {
    vNode.children.forEach((child) => {
      const childElement = createElement(child);
      element.appendChild(childElement);
    });
  }

  return element;
}

export function updateAttributes($el, props) {
  for (const key in props) {
    $el.setAttribute(key, props[key]);
  }
}
