import { getDomAttributeName } from "../utils/domUtils";
import { addEvent } from "./eventManager";

const isEmptyNode = (vNode) =>
  vNode === null || vNode === undefined || typeof vNode === "boolean";

export function createElement(vNode) {
  if (isEmptyNode(vNode)) {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();

    vNode.forEach((vNodeEl) => fragment.appendChild(createElement(vNodeEl)));

    return fragment;
  }

  const { type, props, children } = vNode;
  const element = document.createElement(type);

  updateAttributes(element, props);

  if (children) {
    children.forEach((vNodeChild) => {
      const childElement = createElement(vNodeChild);

      element.appendChild(childElement);
    });
  }

  return element;
}

function updateAttributes($el, props) {
  if (!props) return;

  Object.entries(props).forEach(([key, value]) => {
    $el.setAttribute(getDomAttributeName(key), value);

    if (typeof value !== "function") return;

    const formattedEventType = key.slice(2).toLowerCase();

    $el.__eventHandlers = {};
    $el.__eventHandlers[key] = value;

    addEvent($el, formattedEventType, value);

    $el.removeAttribute(key.toLowerCase());
  });
}
