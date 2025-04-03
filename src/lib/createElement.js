import { addEvent } from "./eventManager";
// 1. vNode가 null, undefined, boolean 일 경우, 빈 텍스트 노드를 반환합니다.
// 2. vNode가 문자열이나 숫자면 텍스트 노드를 생성하여 반환합니다.
// 3. vNode가 배열이면 DocumentFragment를 생성하고 각 자식에 대해 createElement를 재귀 호출하여 추가합니다.
// 4. 위 경우가 아니면 실제 DOM 요소를 생성합니다:
//     - vNode.type에 해당하는 요소를 생성
//     - vNode.props의 속성들을 적용 (이벤트 리스너, className, 일반 속성 등 처리)
//     - vNode.children의 각 자식에 대해 createElement를 재귀 호출하여 추가
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
    const documentFragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      documentFragment.appendChild(createElement(child));
    });
    return documentFragment;
  }

  // 4. 위 경우가 아니면 실제 DOM 요소를 생성합니다:
  // - vNode.type에 해당하는 요소를 생성
  const element = document.createElement(vNode.type);
  // - vNode.props의 속성들을 적용 (이벤트 리스너, className, 일반 속성 등 처리)
  if (vNode.props) {
    updateAttributes(element, vNode.props);
  }
  // - vNode.children의 각 자식에 대해 createElement를 재귀 호출하여 추가
  if (vNode.children) {
    vNode.children.forEach((child) => {
      element.appendChild(createElement(child));
    });
  }

  // 중첩된 자식 요소를 올바르게 처리해야 한다
  if (typeof vNode.type === "function") {
    const component = vNode.type({
      ...vNode.props,
      children: vNode.children,
    });
    return createElement(component);
  }

  return element;
}

function updateAttributes($el, props) {
  //  - vNode.props의 속성들을 적용 (이벤트 리스너, className, 일반 속성 등 처리)
  Object.entries(props).forEach(([key, value]) => {
    if (key === "className") {
      $el.className = value;
    } else if (key.startsWith("on")) {
      // 이벤트 핸들러는 setAttribute를 사용하지 않고 직접 addEvent만 호출
      addEvent($el, key, value);
    } else {
      $el.setAttribute(key, value);
    }
  });
}
