import { extractEventKey, flatDeep, isEvent, treatAsBlank } from "../utils";
import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (treatAsBlank(vNode)) {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  if (Array.isArray(vNode)) {
    const $fragment = document.createDocumentFragment();
    flatDeep(vNode).forEach((v) => $fragment.appendChild(createElement(v)));
    return $fragment;
  }

  if (typeof vNode === "object") {
    const { type, props, children } = vNode;

    const $el = document.createElement(type);
    updateAttributes($el, props);

    flatDeep(children).forEach((child) => {
      $el.appendChild(createElement(child));
    });

    return $el;
  }

  return document.createElement(vNode.type);
}

function updateAttributes($el, props) {
  if (!props) return $el;

  Object.entries(props).forEach(([key, value]) => {
    if (isEvent(key)) {
      addEvent($el, extractEventKey(key), value);
    } else {
      $el.setAttribute(key === "className" ? "class" : key, value);
    }
  });
}
