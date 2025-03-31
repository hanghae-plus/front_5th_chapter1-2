import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (
    vNode === undefined ||
    vNode === null ||
    vNode === true ||
    vNode === false
  ) {
    return document.createTextNode("");
  }

  if (typeof vNode !== "object") {
    return document.createTextNode(String(vNode));
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      const childElement = createElement(child);
      fragment.appendChild(childElement);
    });
    return fragment;
  }

  // 가상 노드 객체인 경우
  if (vNode.type) {
    if (typeof vNode.type === "function") {
      throw new Error("컴포넌트는 createElement로 직접 처리할 수 없습니다.");
    }

    const element = document.createElement(vNode.type);

    updateAttributes(element, vNode.props);

    // 자식 요소 추가
    if (vNode.children) {
      vNode.children.forEach((child) => {
        const childElement = createElement(child);
        element.appendChild(childElement);
      });
    }

    return element;
  }

  // 기본적으로 빈 텍스트 노드 반환
  return document.createTextNode("");
}

function updateAttributes($el, props) {
  if (!props) return;

  Object.entries(props).forEach(([key, value]) => {
    // 이벤트 핸들러
    if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.substring(2).toLowerCase();
      addEvent($el, eventType, value);
    }
    // className 특별 처리
    else if (key === "className") {
      $el.setAttribute("class", value);
    }
    // 일반 속성
    else {
      $el.setAttribute(key, value);
    }
  });
}
