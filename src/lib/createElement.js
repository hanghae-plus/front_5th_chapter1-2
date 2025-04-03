import { addEvent } from "./eventManager";
import { isNotFalsy } from "./normalizeVNode";

export function createElement(vNode) {
  if (!isNotFalsy(vNode)) {
    return document.createTextNode("");
  }

  if (typeof vNode === "number" || typeof vNode === "string") {
    return document.createTextNode(String(vNode));
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((el) => {
      const tag = createElement(el); // 배열 안 요소 재귀
      fragment.appendChild(tag);
    });
    return fragment;
  }

  if (typeof vNode.type === "function") {
    throw new Error("컴포넌트 정규화가 필요합니다 :-)");
  }

  const { type, props, children } = vNode;

  const element = document.createElement(type);

  if (props) {
    // 요소 꺼내서 속성 추가
    updateAttributes(element, props);
  }

  children.forEach((el) => {
    element.appendChild(createElement(el));
  });
  return element;
}

function updateAttributes($el, props) {
  for (const [key, value] of Object.entries(props)) {
    if (key === "className") {
      $el.setAttribute("class", value);
    } else if (typeof value === "function" && key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      addEvent($el, eventType, value);
    } else {
      $el.setAttribute(key, value);
    }
  }
}
