import { addEvent } from "./eventManager";

// 리얼 돔을 만드는 함수
export function createElement(vNode) {
  // 1. vNode가 null, undefined, boolean 일 경우, 빈 텍스트 노드를 반환합니다.
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  // 2. vNode가 문자열이나 숫자면 텍스트 노드를 생성하여 반환합니다.
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  // 3. vNode가 배열이면 DocumentFragment를 생성하고 각 자식에 대해 createElement를 재귀 호출하여 추가합니다.
  if (Array.isArray(vNode)) {
    const $el = document.createDocumentFragment();
    vNode.forEach((child) => {
      $el.appendChild(createElement(child));
    });
    return $el;
  }

  // 4. 위 경우가 아니면 실제 DOM 요소를 생성합니다:

  // vNode.type에 해당하는 요소를 생성
  const $el = document.createElement(vNode.type);
  // vNode.props의 속성들을 적용 (이벤트 리스너, className, 일반 속성 등 처리)
  updateAttributes($el, vNode.props);
  // vNode.children의 각 자식에 대해 createElement를 재귀 호출하여 추가
  vNode.children.forEach((child) => {
    $el.appendChild(createElement(child));
  });

  return $el;
}

function updateAttributes($el, props) {
  Object.entries(props || {})
    .filter(([, value]) => value)
    .forEach(([attr, value]) => {
      if (attr === "className") {
        $el.className = value;
      } else if (attr.startsWith("on") && typeof value === "function") {
        // 모든 이벤트 핸들러 처리
        const eventType = attr.toLowerCase().substring(2); // 'onClick' -> 'click'
        addEvent($el, eventType, value);
      } else {
        $el.setAttribute(attr, value);
      }
    });
}
