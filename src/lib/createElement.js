//import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (
    typeof vNode === "boolean" ||
    typeof vNode === "undefined" ||
    vNode === null
  ) {
    return document.createTextNode("");
  }
  if (typeof vNode === "string" || typeof vNode === "number") {
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

function updateAttributes($el /*props*/) {
  $el.innerHTML = "";
}
