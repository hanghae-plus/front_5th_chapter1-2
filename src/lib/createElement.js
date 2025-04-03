import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.flat().forEach((child) => {
      fragment.appendChild(createElement(child));
    });
    return fragment;
  } else {
    const el = document.createElement(vNode.type);
    const props = vNode.props || {};
    const children = props.children;
    if (children !== undefined && children !== null) {
      const childArray = Array.isArray(children) ? children : [children];
      childArray.forEach((child) => {
        el.appendChild(createElement(child));
      });
    }
    return el;
  }
}

export function updateAttributes($el, props) {
  for (const [key, value] of Object.entries(props)) {
    if (key === "children") continue;

    if (key === "className") {
      $el.setAttribute("class", value);
    }
    if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.slice(2).toLowerCase();
      addEvent($el, eventType, value);
    } else {
      $el.setAttribute(key, value);
    }
  }
  return $el;
}
