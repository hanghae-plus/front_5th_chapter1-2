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
    const fragment = document.createDocumentFragment();
    fragment.append(...vNode.map(createElement));
    return fragment;
  }

  /**
   * 이전에 createElement를 넣는 방식을 확인해봐야할 거 같다.
   * 어떤형식으로 createElement에 들어가는 걸까?
   * https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement 예제를 보니 div, span, p 등등
   * 현재는 type이 [Funtion: TestComponent]임
   */
  if (typeof vNode.type === "function") {
    normalizeVNode(vNode);
  }

  // FuncitonComponent를 사용했을 때 InvalidCharaterError 발생
  const el = document.createElement(vNode.type);
  //함수 일때 처리하기
  updateAttributes(el, vNode.props);
  return el;
}

function updateAttributes($el, props) {
  console.log("el in updateAttributes", $el);
  console.log("props", props);
}
