import { addEvent } from "./eventManager";
import { isRenderableElement } from "../utils";
import { normalizeVNode } from "./normalizeVNode";

export function createElement(vNode) {
  if (!isRenderableElement(vNode)) {
    return document.createTextNode("");
  }

  if (typeof vNode === "string") {
    return document.createTextNode(vNode);
  }

  if (typeof vNode === "number") {
    return document.createTextNode(vNode.toString());
  }

  if (Array.isArray(vNode)) {
    const documentFragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      documentFragment.appendChild(createElement(child));
    });
    return documentFragment;
  }

  if (vNode.type && typeof vNode.type === "function") {
    throw new Error("컴포넌트입니다.");
  }

  const normalizedVNode = normalizeVNode(vNode);
  const $el = document.createElement(normalizedVNode.type);
  updateAttributes($el, normalizedVNode.props);
  $el.appendChild(createElement(normalizedVNode.children));

  return $el;
}

function updateAttributes($el, props) {
  if (!props || typeof props !== "object") return;

  Object.entries(props).forEach(([key, value]) => {
    if (key === "className") {
      $el.className = value;
    } else if (key === "style") {
      if (typeof value === "string") $el.style.cssText = value;
      else Object.assign($el.style, value);
    } else if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      addEvent($el, eventType, value);
    } else if (["disabled", "checked", "hidden"].includes(key)) {
      $el[key] = value;
    } else if (key.startsWith("data-")) {
      $el.dataset[key.replace("data-", "")] = value;
    } else {
      $el.setAttribute(key, value);
    }
  });
}
