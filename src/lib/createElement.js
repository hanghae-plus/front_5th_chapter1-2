import { addEvent } from "./eventManager";

export function createElement(vNode) {
  // 불리언(true/false), null, undefined인 경우 빈 텍스트 노드 생성
  if (typeof vNode === "boolean" || vNode == null || vNode === undefined) {
    return document.createTextNode("");
  }

  // 문자열이나 숫자일 경우 텍스트 노드 생성
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  // 배열인 경우 fragment 생성
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((childNode) => {
      // 각 자식 노드에 대해 createElement를 재귀적으로 호출
      const element = createElement(childNode);
      fragment.appendChild(element);
    });
    return fragment;
  }

  // 단일 가상 노드 객체 처리
  if (typeof vNode === "object") {
    const element = document.createElement(vNode.type);
    // 속성 (props) 추가
    updateAttributes(element, vNode.props);

    // 자식 요소 처리
    if (vNode.children) {
      for (const child of vNode.children) {
        const childElement = createElement(child);
        element.appendChild(childElement);
      }
    }

    return element;
  }
}

function updateAttributes($el, props) {
  if (props) {
    for (const [key, value] of Object.entries(props)) {
      // className을 HTML의 class 속성으로 변환
      if (key === "className") {
        $el.setAttribute("class", value);
      } else if (key.startsWith("on")) {
        // addEvent 함수 실행
        addEvent($el, key.replace(/^on/, "").toLowerCase(), value);
      } else {
        $el.setAttribute(key, value);
      }
    }
  }
}
