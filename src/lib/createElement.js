import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (
    vNode === null ||
    typeof vNode === "undefined" ||
    typeof vNode === "boolean"
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
  if (typeof vNode === "function") throw new Error();

  const { type, props, children } = vNode;
  const $el = document.createElement(type);
  if (props) updateAttributes($el, props);
  if (children)
    children.forEach((child) => {
      $el.append(createElement(child));
    });

  return $el;
}

function updateAttributes($el, props) {
  Object.entries(props).forEach(([key, value]) => {
    if (key === "className") key = "class";
    if (typeof value === "function") {
      addEvent($el, key.replace("on", "").toLowerCase(), value);
    } else {
      $el.setAttribute(key, value);
    }
  });
}
