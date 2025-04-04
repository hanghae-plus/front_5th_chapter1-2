import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode(""); // 빈 텍스트 노드
  }
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode)); // 텍스트 노드
  }
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment(); // DocumentFragment 생성
    vNode.forEach((child) => {
      const childElement = createElement(child);
      fragment.appendChild(childElement); // 각 항목을 Fragment에 추가
    });
    return fragment;
  }

  const element = document.createElement(vNode.type);
  if (vNode.children) {
    vNode.children.forEach((child) => {
      const childElement = createElement(child);
      element.appendChild(childElement);
    });
  }
  updateAttributes(element, vNode.props);
  return element;
}

function updateAttributes($el, props) {
  if (props) {
    for (const key in props) {
      if (Object.prototype.hasOwnProperty.call(props, key)) {
        if (key.startsWith("on")) {
          const eventType = key.slice(2).toLowerCase();
          addEvent($el, eventType, props[key]);
        } else if (key === "className") {
          $el.setAttribute("class", props[key]);
        } else {
          $el.setAttribute(key, props[key]);
        }
      }
    }
  }
}
