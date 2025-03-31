import { addEvent } from "./eventManager";
import { normalizeVNode } from "./normalizeVNode";

export function createElement(vNode) {
  const normalizedVNode = normalizeVNode(vNode);

  if (typeof normalizedVNode === "string") {
    return document.createTextNode(normalizedVNode);
  }

  if (Array.isArray(normalizedVNode)) {
    const el = document.createDocumentFragment();
    normalizedVNode.forEach((child) => {
      const childEl = createElement(child);
      el.appendChild(childEl);
    });
    return el;
  }

  if (typeof normalizedVNode === "object") {
    const { type, children, props } = vNode;
    const el = document.createElement(type);
    updateAttributes(el, props);

    children.forEach((child) => {
      const childEl = createElement(child);
      el.appendChild(childEl);
    });
    return el;
  }
}

function updateAttributes($el, props) {
  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      if (key === "className") {
        $el.setAttribute("class", value);
      } else if (key.startsWith("on")) {
        const eventName = key.slice(2).toLowerCase();
        addEvent($el, eventName, value);
      } else {
        $el.setAttribute(key, value);
      }
    });
  }
}
