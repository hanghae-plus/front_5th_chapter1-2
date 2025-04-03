import { addEvent } from "./eventManager";

export function createElement(vNode) {
  // undefined, null, false, true -> 빈 텍스트 노드로 변환
  if (vNode === undefined || vNode === null || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  // Hello, 42, 0, -0, 10000 -> 텍스트 노드로 변환
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  // 배열 입력에 대해 DocumentFragment를 생성
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    fragment.append(...vNode.map(createElement));
    return fragment;
  }

  const el = document.createElement(vNode.type);

  if (vNode.props) {
    updateAttributes(el, vNode.props);
  }
  vNode.children.forEach((item) => {
    el.appendChild(createElement(item));
  });
  return el;
}

function updateAttributes($el, props) {
  // element와 element의 props를 받아서 새로운 element의 속성값들을 세팅해줌
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith("on") && typeof value === "function") {
      // 이벤트 처리 (onClick -> click)
      const eventType = key.slice(2).toLowerCase();
      addEvent($el, eventType, value);
    } else if (key === "className") {
      // className -> class 변환
      $el.setAttribute("class", value); // element.setAttribute(attributeName, value) DOM요소에 속성값을 설정. 속성이 이미 존재하는 경우 값이 업데이트됨.
    } else {
      // 일반 속성
      $el.setAttribute(key, value);
    }
  });
}
