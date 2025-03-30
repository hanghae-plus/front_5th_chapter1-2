import { addEvent } from "./eventManager";
import { normalizeVNode } from "./normalizeVNode";

export function createElement(vNode) {
  const normalizedVNode = normalizeVNode(vNode);

  // 배열인 경우: DocumentFragment를 생성해서 각 요소를 재귀적으로 추가
  if (Array.isArray(normalizedVNode)) {
    const fragment = document.createDocumentFragment();
    normalizedVNode.forEach((child) => {
      fragment.appendChild(createElement(child));
    });
    return fragment;
  }

  // null, undefined, boolean: 빈 텍스트 노드로 처리
  if (
    normalizedVNode === null ||
    normalizedVNode === undefined ||
    typeof normalizedVNode === "boolean"
  ) {
    return document.createTextNode("");
  }

  // 문자열 또는 숫자: 텍스트 노드로 처리
  if (
    typeof normalizedVNode === "string" ||
    typeof normalizedVNode === "number"
  ) {
    return document.createTextNode(normalizedVNode.toString());
  }

  // 객체 타입 (정상적인 VNode인 경우)
  const $el = document.createElement(normalizedVNode.type);

  updateAttributes($el, normalizedVNode.props);

  normalizedVNode.children.forEach((child) => {
    $el.appendChild(createElement(child));
  });

  return $el;
}

function updateAttributes($el, props) {
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith("on")) {
      addEvent($el, key, value);
    } else {
      $el.setAttribute(key, value);
    }
  });
}
