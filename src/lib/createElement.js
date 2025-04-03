import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (vNode === undefined || vNode === null || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    const childNodes = vNode.map(createElement);
    childNodes.forEach((child) => {
      fragment.appendChild(child);
    });

    return fragment;
  }

  if (typeof vNode === "object") {
    if (typeof vNode.type === "function") {
      throw new Error();
    }

    const element = document.createElement(vNode.type);
    updateAttributes(element, vNode.props);
    const childNodes = vNode.children?.map(createElement) ?? [];
    childNodes.forEach((child) => {
      element.appendChild(child);
    });

    return element;
  }
}

function updateAttributes($el, props) {
  if (!props) return;

  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.replace("on", "").toLowerCase();
      addEvent($el, eventType, value);
    } else if (key === "className") {
      $el.className = value;
    } else {
      $el.setAttribute(key, value);
    }
  });
}
