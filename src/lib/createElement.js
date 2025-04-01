import { addEvent } from "./eventManager";

export function createElement(vNode) {
  // 1. falsy 값 처리 (undefined, null, false, true) - 빈 노드 반환
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    const falsyNode = document.createTextNode("");
    return falsyNode;
  }

  // 2. 문자열과 숫자는 문자열로 변환되어야 한다.
  if (typeof vNode === "string" || typeof vNode === "number") {
    const textNode = document.createTextNode(String(vNode));
    return textNode;
  }

  // 3. 배열이면 DocumentFragment 생성
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      const childElement = createElement(child);
      if (childElement instanceof Node) fragment.appendChild(childElement); // 노드일떄 처리 - Vitest의 spy 함수가 노출되는 이슈
    });

    return fragment;
  }

  // 5. 일반 엘리먼트 처리
  if (vNode.type) {
    const element = document.createElement(vNode.type);

    // props 처리
    if (vNode.props) {
      Object.entries(vNode.props).forEach(([key, value]) => {
        if (key.startsWith("on")) {
          const eventType = key.toLowerCase().slice(2); // onClick -> click
          addEvent(element, eventType, value);
          return;
        }

        if (key === "className") {
          element.setAttribute("class", value);
          return;
        }

        element.setAttribute(key, value);
      });
    }

    // children 처리
    if (vNode.children) {
      vNode.children.forEach((child) => {
        const childElement = createElement(child);
        element.appendChild(childElement);
      });
    }

    return element;
  }
  return vNode;
}

// function updateAttributes($el, props) {}
