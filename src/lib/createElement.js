import { isEmptyStrType, isNumericOrStr } from "../utils/typeUtils";
import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (isEmptyStrType(vNode)) {
    return document.createTextNode("");
  }
  if (isNumericOrStr(vNode)) {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();

    vNode.forEach((item) => {
      const element = document.createElement(item.type);
      fragment.appendChild(element);
    });

    return fragment;
  }

  if (typeof vNode.type === "function") {
    throw new Error("함수 컴포넌트는 createElement로 처리할 수 없습니다.");
  }

  // 컴포넌트를 element로 만들어 반환하기
  const { type, props, children } = vNode;
  const element = document.createElement(type);

  if (props) {
    updateAttributes(element, props);
  }

  if (children && Array.isArray(children)) {
    children.forEach((child) => {
      const childElement = createElement(child);
      if (childElement.nodeType === Node.TEXT_NODE) {
        element.appendChild(document.createTextNode(childElement.textContent));
      } else {
        element.appendChild(childElement);
      }
    });
  }

  return element;
}

function updateAttributes($el, props) {
  Object.entries(props).forEach(([key, value]) => {
    if (key === "className") {
      $el.setAttribute("class", value);
      return;
    }
    if (key.startsWith("on")) {
      const event = key.toLowerCase().slice(2);
      addEvent($el, event, value);
      return;
    }
    $el.setAttribute(key, value);
  });
}
