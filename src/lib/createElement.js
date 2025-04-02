import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (typeof vNode === "boolean" || vNode === undefined || vNode === null) {
    return document.createTextNode("");
  } else if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  } else if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    fragment.append(...vNode.map(createElement));
    return fragment;
  } else if (typeof vNode.type === "function") {
    throw Error;
  } else {
    const element = document.createElement(vNode.type);

    if (vNode.props) {
      updateAttributes(element, vNode.props);
    }
    vNode.children.forEach((item) => {
      element.appendChild(createElement(item));
    });
    return element;
  }
}

function updateAttributes($el, props) {
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.slice(2).toLowerCase();
      addEvent($el, eventType, value);
    } else if (key === "className") {
      $el.setAttribute("class", value);
    } else {
      $el.setAttribute(key, value);
    }
  });
}
