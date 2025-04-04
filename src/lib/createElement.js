import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean")
    return document.createTextNode("");

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();

    const elements = vNode.map(createElement);
    elements.forEach((element) => fragment.appendChild(element));

    return fragment;
  }

  const element = document.createElement(vNode.type);

  if (vNode.props) {
    updateAttributes(element, vNode.props);
  }

  if (vNode.children && Array.isArray(vNode.children)) {
    const children = vNode.children.map(createElement);

    children.forEach((child) => element.appendChild(child));
  }

  return element;
}

function updateAttributes($el, props) {
  Object.keys(props).forEach((key) => {
    if (typeof props[key] === "function") {
      const eventType = key.replace(/^on/i, "").toLowerCase();

      addEvent($el, eventType, props[key]);
      return;
    }

    if (key === "className") {
      $el.setAttribute("class", props[key]);
      return;
    }

    $el.setAttribute(key, props[key]);
  });
}
