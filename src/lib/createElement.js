import { addEvent } from "./eventManager";

export function createElement(vNode) {
  // 배열인 경우: DocumentFragment를 생성해서 각 요소를 재귀적으로 추가
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      fragment.appendChild(createElement(child));
    });
    return fragment;
  }

  // null, undefined, boolean: 빈 텍스트 노드로 처리
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  // 문자열 또는 숫자: 텍스트 노드로 처리
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode.toString());
  }

  // 객체 타입 (정상적인 VNode인 경우)
  const $el = document.createElement(vNode.type);

  updateAttributes($el, vNode.props);

  vNode.children.forEach((child) => {
    $el.appendChild(createElement(child));
  });

  return $el;
}

function updateAttributes($el, props) {
  if (props === null || props === undefined) {
    return;
  }

  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith("on")) {
      const eventType = key.toLowerCase().substring(2);
      addEvent($el, eventType, value);
    } else if (key === "className") {
      $el.setAttribute("class", value);
    } else {
      $el.setAttribute(key, value);
    }
  });
}
