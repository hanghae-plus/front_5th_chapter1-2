import { addEvent } from "./eventManager";

export function createElement(vNode) {
  // vNode가 null, undefined, boolean 일 경우, 빈 텍스트 노드를 반환합니다.
  if (typeof vNode === "boolean" || vNode === null || vNode === undefined) {
    return document.createTextNode("");
  }

  // vNode가 문자열이나 숫자면 텍스트 노드를 생성하여 반환합니다.
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  // vNode가 배열이면 DocumentFragment를 생성하고 각 자식에 대해 createElement를 재귀 호출하여 추가합니다.
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => fragment.appendChild(createElement(child)));
    return fragment;
  }

  // 위 경우가 아니면 실제 DOM 요소를 생성합니다:
  // 1. vNode.type에 해당하는 요소를 생성
  const element = document.createElement(vNode.type);

  /**
   * Refactor - 함수로 빼도 괜찮을 듯 하다.
   */
  // 2. vNode.props의 속성들을 적용 (이벤트 리스너, className, 일반 속성 등 처리)
  Object.entries(vNode.props || {}).forEach(([key, value]) => {
    if (key === "className") {
      element.setAttribute("class", value);
    } else if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.slice(2).toLowerCase();
      addEvent(element, eventType, value);
    } else {
      element.setAttribute(key, value);
    }
  });

  (vNode.children || []).forEach((child) => {
    // 3. vNode.children의 각 자식에 대해 createElement를 재귀 호출하여 추가
    element.appendChild(createElement(child));
  });

  return element;
}

// function updateAttributes($el, props) {}
