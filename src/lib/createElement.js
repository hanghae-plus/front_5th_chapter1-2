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
      const childNode = createElement(child);
      if (childNode) fragment.appendChild(childNode);
    });
    return fragment;
  }

  const $el = document.createElement(vNode.type);
  if (vNode.props) updateAttributes($el, vNode.props);

  (vNode.children || []).forEach((child) => {
    const childNode = createElement(child);
    if (childNode) $el.appendChild(childNode);
  });

  return $el;
}

function updateAttributes($el, props) {
  for (const [key, value] of Object.entries(props)) {
    if (key.startsWith("on") && typeof value === "function") {
      registerEvent($el, key, value);
      continue;
    }

    if (key === "className") {
      $el.className = value;
      continue;
    }

    if (key in $el) {
      $el[key] = value;
      continue;
    }

    if (value !== null && value !== false) {
      $el.setAttribute(key, value);
    }
  }
}

function registerEvent($el, key, handler) {
  const eventType = key.toLowerCase().substring(2);
  addEvent($el, eventType, handler);
}
