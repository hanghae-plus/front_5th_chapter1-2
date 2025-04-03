// import { addEvent } from "./eventManager";

export function createElement(vNode) {
  const v = typeof vNode;
  if (v === "boolean" || v === "undefined" || vNode === null) {
    return document.createTextNode("");
  }
  if (v === "string" || v === "number") {
    return document.createTextNode(vNode);
  }

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
  return { $el, props }; // 함수일때에 반환하는 코드를 작성.  각각 테스트 코드에 맞는 코드를 작성하면됨.
}
