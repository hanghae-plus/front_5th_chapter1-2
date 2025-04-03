import { addEvent } from "./eventManager";

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
    const $fragment = document.createDocumentFragment();
    $fragment.append(...vNode.map(createElement));
    return $fragment;
  }

  // 4. 위 경우가 아니면 실제 DOM 요소를 생성합니다:
  // 4-1. vNode.type에 해당하는 요소를 생성
  const $element = document.createElement(vNode.type);
  console.log("$element: ", $element);

  // 4-2. vNode.props의 속성들을 적용 (이벤트 리스너, className, 일반 속성 등 처리)
  updateAttributes($element, vNode.props);

  // 4-3. vNode.children의 각 자식에 대해 createElement를 재귀 호출하여 추가
  $element.append(...vNode.children.map(createElement));

  return $element;
}

function updateAttributes($el, props) {
  // props가 undefined 거나 null 일 때
  if (props === undefined || props === null) {
    return;
  }

  Object.entries(props).forEach(([name, value]) => {
    // 이벤트
    if (/^on*/.test(name)) {
      addEvent($el, name.slice(2).toLowerCase(), value);
      return;
    }

    // class
    if (name === "className") {
      $el.setAttribute("class", value);
      return;
    }

    // 일반 속성
    $el.setAttribute(name, value);
  });
}
