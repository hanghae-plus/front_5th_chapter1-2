import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (vNode === null || typeof vNode === "boolean" || vNode === undefined) {
    return document.createTextNode("");
  }
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }
  if (Array.isArray(vNode)) {
    var fragment = document.createDocumentFragment();
    console.log(fragment);

    vNode.map((child) => {
      const childElement = createElement(child);
      if (childElement) {
        fragment.appendChild(childElement);
      }
    });
    return fragment;
  }

  if (typeof vNode === "object") {
    const $el = document.createElement(vNode.type);
    updateAttributes($el, vNode.props);
    if (vNode.children) {
      vNode.children.forEach((child) => {
        const childElement = createElement(child);
        $el.appendChild(childElement);
      });
    }
    return $el;
  }
  if (typeof vNode.type === "function") {
    throw new Error();
  }
}
function updateAttributes($el, props) {
  Object.entries(props || {})
    .filter(([, value]) => value)
    .forEach(([attr, value]) => {
      if (attr === "className") {
        $el.setAttribute("class", value);
      } else if (attr.startsWith("on")) {
        const eventType = attr.substring(2).toLowerCase();
        addEvent($el, eventType, value);
      } else {
        $el.setAttribute(attr, value);
      }
    });
}
