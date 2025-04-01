import { updateAttributes } from "./updateAttributes.js";

export function createElement(vNode) {
  // 배열: DocumentFragment를 생성해서 각 요소를 재귀적으로 추가
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      fragment.appendChild(createElement(child));
    });
    return fragment;
  }

  // null, undefined, boolean: 빈 텍스트 노드로 처리
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  // 문자열 또는 숫자: 텍스트 노드로 처리
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode.toString());
  }

  // 객체 타입(VNode)
  const element = document.createElement(vNode.type);

  updateAttributes(element, vNode.props);

  vNode.children.forEach((child) => {
    element.appendChild(createElement(child));
  });

  return element;
}
