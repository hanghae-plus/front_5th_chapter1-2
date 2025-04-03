import { addEvent } from "./eventManager";
import { normalizeVNode } from "./normalizeVNode";

function transformCreateElement(vNode) {
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    for (const child of vNode) {
      const childNode = transformCreateElement(child);
      if (childNode !== null) {
        fragment.appendChild(childNode);
      }
    }
    return fragment;
  }

  if (
    typeof vNode === "undefined" ||
    typeof vNode === "boolean" ||
    vNode === null
  ) {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  const $el = document.createElement(vNode.type);

  if (vNode.children) {
    for (const child of vNode.children) {
      const childNode = transformCreateElement(child);
      if (childNode !== null) {
        $el.appendChild(childNode);
      }
    }
  }

  updateAttributes($el, vNode.props);
  return $el;
}

export function createElement(vNode) {
  if (vNode && typeof vNode.type === "function") {
    throw new Error("error");
  }
  return transformCreateElement(normalizeVNode(vNode));
}

function updateAttributes($el, props) {
  if (!props) return;

  for (const key in props) {
    const value = props[key];
    if (key === "className") {
      $el.setAttribute("class", value);
    } else if (key.startsWith("on")) {
      let eventType = key.slice(2).toLowerCase();
      addEvent($el, eventType, value);
    } else {
      $el.setAttribute(key, value);
    }
  }
}