import { addEvent } from "./eventManager";

export function createElement(vNode) {
  // undefined, null, false, true -> 빈 텍스트 노드로 변환
  if (vNode === undefined || vNode === null || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  //Hello, 42, 0, -0, 10000 -> 텍스트 노드로 변환
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  //배열 입력에 대해 DocumentFragment를 생성 TODO
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    fragment.append(...vNode.map(createElement));
    return fragment;
  }
  const el = document.createElement(vNode.type);
  updateAttributes(el, vNode.props);
  return el;
}

function updateAttributes($el, props) {
  $el;
}
