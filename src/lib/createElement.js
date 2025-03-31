import { addEvent } from "./eventManager.js";

export function createElement(vNode) {
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      const childElement = createElement(child);
      fragment.appendChild(childElement);
    });
    return fragment;
  }
  if (
    vNode === undefined ||
    vNode === null ||
    vNode === false ||
    vNode === true
  ) {
    return document.createTextNode("");
  }
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode.toString());
  }
  const element = document.createElement(vNode.type);
  if (vNode.props) {
    updateAttributes(element, vNode.props);
  }
  if (vNode.children && vNode.children.length > 0) {
    console.log(vNode.children);
    vNode.children.forEach((child) => {
      const childElement = createElement(child);
      element.appendChild(childElement);
    });
  }
  return element;
}

function updateAttributes($el, props) {
  if (!props) return;
  Object.keys(props).forEach((key) => {
    if (key.startsWith("on") && typeof props[key] === "function") {
      const eventType = key.toLowerCase().substring(2);
      addEvent($el, eventType, props[key]);
      return;
    }
    if (key === "children") return;
    if (key === "className") {
      $el.setAttribute("class", props[key]);

      return;
    }
    $el.setAttribute(key, props[key]);
  });
}
