import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (
    vNode === null ||
    vNode === undefined ||
    vNode === false ||
    vNode === true
  ) {
    return document.createTextNode("");
  }

  if (typeof vNode === "number" || typeof vNode === "string") {
    return document.createTextNode(String(vNode));
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      fragment.appendChild(createElement(child));
    });
    return fragment;
  }

  if (typeof vNode === "object" && typeof vNode.type === "function") {
    throw new Error("Function components are not supported");
  }

  const $el = document.createElement(vNode.type);
  updateAttributes($el, vNode.props ?? {});

  const children = vNode.children.map(createElement);
  children.forEach((child) => {
    $el.appendChild(child);
  });

  return $el;
}

function updateAttributes($el, props) {
  for (const [key, value] of Object.entries(props)) {
    if (key === "className") {
      $el.setAttribute("class", value);
    } else if (key === "id") {
      $el.setAttribute(key, value);
    } else if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      addEvent($el, eventType, value);
    } else {
      $el.setAttribute(key, value);
    }
  }
}
