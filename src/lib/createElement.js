import { addEvent } from "./eventManager";

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

  const el = updateAttributes(document.createElement(vNode.type), vNode.props);
  vNode.children.map(createElement).forEach((child) => el.appendChild(child));
  return el;
}

function updateAttributes(el, props) {
  Object.entries(props || {}).forEach(([attr, value]) => {
    if (attr.startsWith("on")) {
      addEvent(el, attr.slice(2).toLowerCase(), value);
    } else {
      if (attr === "className") {
        attr = "class";
      }
      el.setAttribute(attr, value);
    }
  });

  return el;
}
