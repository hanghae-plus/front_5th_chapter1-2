import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();

    vNode.forEach((child) => {
      const $child = createElement(child);
      fragment.appendChild($child);
    });
    return fragment;
  }

  const $el = document.createElement(vNode.type);

  if (Array.isArray(vNode.children)) {
    vNode.children.forEach((child) => {
      const $child = createElement(child);
      $el.appendChild($child);
    });
  }

  if (vNode.props) {
    Object.entries(vNode.props).forEach(([key, value]) => {
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

  return $el;
}

// function updateAttributes($el, props) {}
