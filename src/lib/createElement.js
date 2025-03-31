import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (vNode === undefined || vNode === null || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();

    vNode.forEach((child) => {
      const childElement = createElement(child);
      if (childElement) {
        fragment.appendChild(childElement);
      }
    });

    return fragment;
  }

  if (typeof vNode === "object" && vNode.type) {
    const element = document.createElement(vNode.type);
    Object.entries(vNode.props || {})
      .filter(([, value]) => value)
      .forEach(([attribute, value]) => {
        if (attribute === "className") {
          element.setAttribute("class", value);
        } else {
          element.setAttribute(attribute, value);
        }
      });

    const children = vNode.children?.map(createElement) || [];
    children.forEach((child) => element.appendChild(child));
    return element;
  }
}

function updateAttributes($el, props) {}
