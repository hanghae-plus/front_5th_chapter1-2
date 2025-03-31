import { isNullishOrBoolean } from "./createVNode";
import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (typeof vNode?.type === "function") {
    throw new Error(
      "function component must be normalized before creating element",
    );
  }

  if (isNullishOrBoolean(vNode)) {
    return document.createTextNode("");
  }

  if (typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  if (typeof vNode === "string") {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode)) {
    const el = document.createDocumentFragment();
    vNode.forEach((child) => {
      const childEl = createElement(child);
      el.appendChild(childEl);
    });
    return el;
  }

  if (typeof vNode === "object") {
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
