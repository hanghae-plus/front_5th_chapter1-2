import { addEvent } from "./eventManager";

export function createElement(vNode) {
  // 1. vNode가 null, undefined, boolean 일 경우, 빈 텍스트 노드를 반환합니다
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode(""); // DOM에 직접 추가가 가능하도록 실제 DOM 테스트 노드를 반환
  }
  // 2. vNode가 문자열이나 숫자면 텍스트 노드를 생성하여 반환합니다.
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }
  // 3. vNode가 배열이면 DocumentFragment를 생성하고 각 자식에 대해 createElement를 재귀 호출하여 추가합니다.
  if (Array.isArray(vNode)) {
    const $fragment = document.createDocumentFragment();
    vNode.forEach((child) => $fragment.appendChild(createElement(child)));
    return $fragment;
  }
  // 4. 위 경우가 아니면 실제 DOM 요소를 생성합니다:
  // - vNode.type에 해당하는 요소를 생성
  const $el = document.createElement(vNode.type);
  // - vNode.props의 속성들을 적용 (이벤트 리스너, className, 일반 속성 등 처리)
  updateAttributes($el, vNode.props);
  // - vNode.children의 각 자식에 대해 createElement를 재귀 호출하여 추가
  if (vNode.children) {
    // 자식 노드가 있으면
    vNode.children.forEach((child) => {
      // 자식 노드를 생성
      const childNode = createElement(child);
      // 자식 노드가 있으면 추가
      if (childNode) {
        $el.appendChild(childNode);
      }
    });
  }
  return $el;
}

function updateAttributes($el, props) {
  // - vNode.props의 속성들을 적용 (이벤트 리스너, className, 일반 속성 등 처리)
  if (!props) return;

  Object.entries(props).forEach(([key, value]) => {
    // 이벤트 리스너 처리
    if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      addEvent($el, eventType, value);
      return; // 이벤트 핸들러가 일반 속성으로도 처리되는 것 방지
    }
    // className 처리
    if (key === "className") {
      $el.setAttribute("class", value);
      return; // 이벤트 핸들러가 일반 속성으로도 처리되는 것 방지
    }
    // 일반 속성 처리
    if (value !== null && value !== false) {
      $el.setAttribute(key, value);
    }
  });
}
