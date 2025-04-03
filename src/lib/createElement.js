import { addEvent } from "./eventManager";

/**
 * 1. vNode가 null, undefined, boolean 일 경우, 빈 텍스트 노드를 반환합니다.
2. vNode가 문자열이나 숫자면 텍스트 노드를 생성하여 반환합니다.
3. vNode가 배열이면 DocumentFragment를 생성하고 각 자식에 대해 createElement를 재귀 호출하여 추가합니다.
4. 위 경우가 아니면 실제 DOM 요소를 생성합니다:
    - vNode.type에 해당하는 요소를 생성
    - vNode.props의 속성들을 적용 (이벤트 리스너, className, 일반 속성 등 처리)
    - vNode.children의 각 자식에 대해 createElement를 재귀 호출하여 추가
 * @param {*} vNode 
 * @returns 
 */
export function createElement(vNode) {
  // null, undefined, boolean 처리
  if (vNode == null || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  // 문자열이나 숫자 처리
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  // 배열 처리
  if (Array.isArray(vNode)) {
    const $el = document.createDocumentFragment();
    vNode.forEach((child) => {
      if (child != null) {
        // null이나 undefined가 아닌 경우만 처리
        $el.appendChild(createElement(child));
      }
    });
    return $el;
  }

  // 함수형 컴포넌트 처리
  if (typeof vNode.type === "function") {
    throw new Error("함수형 컴포넌트는 지원하지 않습니다.");
  }

  // 여기에 일반 HTML 요소 생성 로직 추가
  const $el = document.createElement(vNode.type);

  // 속성 적용
  if (vNode.props) {
    updateAttributes($el, vNode.props);
  }

  // 자식 요소 추가
  if (vNode.children) {
    vNode.children.forEach((child) => {
      if (child != null) {
        // null이나 undefined가 아닌 경우만 처리
        $el.appendChild(createElement(child));
      }
    });
  }

  return $el;
}

function updateAttributes($el, props) {
  if (!props) return;

  Object.entries(props).forEach(([name, value]) => {
    // 이벤트 처리
    if (name.startsWith("on") && typeof value === "function") {
      const eventType = name.toLowerCase().substring(2);
      addEvent($el, eventType, value);
    }
    // className 처리
    else if (name === "className") {
      $el.setAttribute("class", value);
    }
    // 일반 속성 처리
    else if (name !== "children" && name !== "key") {
      if (value === true) {
        $el.setAttribute(name, "");
      } else if (value !== false && value != null) {
        $el.setAttribute(name, value);
      }
    }
  });
}
