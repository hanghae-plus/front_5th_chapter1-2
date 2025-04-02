import { type } from "@testing-library/user-event/dist/cjs/utility/type.js";
import { addEvent } from "./eventManager";

export function createElement(vNode) {
  // undefined, null, false, true -> 빈 텍스트 노드로 변환
  if (vNode === undefined || vNode === null || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  //Hello, 42, 0, -0, 10000 -> 텍스트 노드로 변환
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  //배열 입력에 대해 DocumentFragment를 생성
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

//컴포넌트를 정규화한 다음에 createElement로 생성할 수 있다.
function updateAttributes($el, props) {
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.slice(2).toLowerCase();
      addEvent($el, eventType, value);
    } else if (key === "className") {
      $el.setAttribute("class", value);
    } else {
      $el.setAttribute(key, value);
    }
  });
}
