import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  // 배열 노드 처리
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();

    vNode.forEach((child) => {
      const nodeElement = createElement(child);
      fragment.appendChild(nodeElement);
    });

    return fragment;
  }

  // type(태그명)으로 element 생성
  const element = document.createElement(vNode.type);

  // Element 속성 처리
  if (vNode.props) {
    updateAttributes(element, vNode.props);
  }

  // 자식 노드 처리
  if (Array.isArray(vNode.children)) {
    vNode.children.forEach((child) => {
      const nodeElement = createElement(child);
      element.appendChild(nodeElement);
    });
  }

  return element;
}

function updateAttributes($el, props) {
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith("on") && typeof value === "function") {
      // onClick -> click on이름 제거
      const eventType = key.slice(2).toLowerCase();
      addEvent($el, eventType, value);
      return;
    }

    if (key === "className") {
      key = key.replace("className", "class");
    }

    $el.setAttribute(key, value);
  });
}
