import { normalizeVNode } from "./normalizeVNode.js";

export function createElement(vNode) {
  // console.log("vNode's type");
  // console.log(typeof vNode);
  // console.log("vNode's content");
  // console.log(vNode);
  //테스트 케이스 1 (불리언, undefined, null 처리)
  if (
    typeof vNode === "boolean" ||
    typeof vNode === "undefined" ||
    vNode === null
  ) {
    return document.createTextNode("");
  }
  //테스트 케이스 2 (숫자, 스트링 처리)
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  //배열일때 처리
  if (Array.isArray(vNode)) {
    console.log("vNode", vNode);
    const fragment = document.createDocumentFragment();
    fragment.append(...vNode.map(createElement));
    return fragment;
  }

  /**
   * 이전에 createElement를 넣는 방식을 확인해봐야할 거 같다.
   * 어떤형식으로 createElement에 들어가는 걸까?
   * https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement 예제를 보니 div, span, p 등등
   * 현재는 type이 [Funtion: TestComponent]임
   * 함수일때 처리하기
   */
  if (typeof vNode.type === "function") {
    console.log("함수형 컴포넌트 처리");
    // 컴포넌트 정규화 후 결과 사용
    const normalizedNode = normalizeVNode(vNode);
    console.log("정규화된 컴포넌트:", normalizedNode);
    // 정규화된 노드로 createElement 다시 호출
    return createElement(normalizedNode);
  }

  // FuncitonComponent를 사용했을 때 InvalidCharaterError 발생
  const $el = document.createElement(vNode.type);
  // 속성 설정
  if (vNode.props) {
    updateAttributes($el, vNode.props);
  }

  // 자식 요소 처리
  if (vNode.children) {
    if (Array.isArray(vNode.children)) {
      vNode.children.forEach((child) => {
        const childEl = createElement(child);
        if (childEl) $el.appendChild(childEl);
      });
    } else {
      const childEl = createElement(vNode.children);
      if (childEl) $el.appendChild(childEl);
    }
  }

  return $el;
}

function updateAttributes($el, props) {
  if (!props) return;
  console.log("props", props);
  // 객체형 props 처리
  Object.entries(props).forEach(([key, value]) => {
    if (key === "className") {
      $el.setAttribute("class", value);
    }
    // 일반 속성 처리
    else if (value !== false && value !== null && value !== undefined) {
      $el.setAttribute(key, value);
    }
  });
}
