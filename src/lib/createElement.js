import { addEvent } from "./eventManager";

/*
  1. vNode가 null, undefined, boolean 일 경우, 빈 텍스트 노드를 반환합니다.
  2. vNode가 문자열이나 숫자면 텍스트 노드를 생성하여 반환합니다.
  3. vNode가 배열이면 DocumentFragment를 생성하고 각 자식에 대해 createElement를 재귀 호출하여 추가합니다.
  4. 위 경우가 아니면 실제 DOM 요소를 생성합니다:
    - vNode.type에 해당하는 요소를 생성
    - vNode.props의 속성들을 적용 (이벤트 리스너, className, 일반 속성 등 처리)
    - vNode.children의 각 자식에 대해 createElement를 재귀 호출하여 추가
*/

export function createElement(vNode) {
  // Case 1
  if (vNode === null || vNode === undefined || typeof vNode === "boolean")
    return document.createTextNode("");

  // Case 2
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  // Case 3
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();

    if (vNode.children) {
      vNode.children.forEach((child) => {
        const childElement = createElement(child);
        fragment.appendChild(childElement);
      });
    } else {
      vNode.forEach((child) => {
        const childElement = createElement(child);
        fragment.appendChild(childElement);
      });
    }

    return fragment;
  }

  // Case 4
  const element = document.createElement(vNode.type);

  if (vNode.props) {
    updateAttributes(element, vNode.props);
  }

  vNode.children.forEach((child) => {
    if (!child) return;
    const childElement = createElement(child);
    if (childElement) {
      element.appendChild(childElement);
    }
  });

  return element;
}

function updateAttributes($el, props) {
  const propsKeys = Object.keys(props);

  for (const key of propsKeys) {
    if (typeof props[key] === "function") {
      const eventType = key.toLowerCase().substring(2);
      addEvent($el, eventType, props[key]);
    } else if (key === "className") {
      $el.setAttribute("class", props[key]);
    } else {
      $el.setAttribute(key, props[key]);
    }
  }
}
