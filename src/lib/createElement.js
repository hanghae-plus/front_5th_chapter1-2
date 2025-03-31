// 1. vNode가 null, undefined, boolean 일 경우, 빈 텍스트 노드를 반환합니다.
// 2. vNode가 문자열이나 숫자면 텍스트 노드를 생성하여 반환합니다.
// 3. vNode가 배열이면 DocumentFragment를 생성하고 각 자식에 대해 createElement를 재귀 호출하여 추가합니다.
// 4. 위 경우가 아니면 실제 DOM 요소를 생성합니다:
//     - vNode.type에 해당하는 요소를 생성
//     - vNode.props의 속성들을 적용 (이벤트 리스너, className, 일반 속성 등 처리)
//     - vNode.children의 각 자식에 대해 createElement를 재귀 호출하여 추가

import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode)) {
    const $el = document.createDocumentFragment();
    vNode.forEach((child) => {
      $el.appendChild(createElement(child));
    });
    return $el;
  }

  const $el = document.createElement(vNode.type);
  updateAttributes($el, vNode.props);
  vNode.children.forEach((child) => {
    $el.appendChild(createElement(child));
  });
  return $el;
}

function updateAttributes($el, props) {
  Object.entries(props).forEach(([key, value]) => {
    switch (key) {
      case "className":
        $el.className = value;
        break;
      case "onClick":
        addEvent($el, "click", value);
        break;
      default:
        $el[key] = value;
    }
  });
}
