import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (typeof vNode === "boolean" || vNode === null || vNode === undefined) {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();

    for (const { type, children } of vNode) {
      const child = document.createElement(type);
      child.textContent = `${children[0]}`;
      fragment.appendChild(child);
    }

    return fragment;
  }

  if (typeof vNode === "object" && vNode.type) {
    const el = document.createElement(vNode.type);

    if (vNode.props) {
      updateAttributes(el, vNode.props);
    }

    for (const child of vNode.children || []) {
      el.appendChild(createElement(child));
    }

    return el;
  }

  return new Error("컴포넌트는 처리할 수 없습니다.");
}

function updateAttributes($el, props) {
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      addEvent($el, eventType, value);
      return;
    }

    if (key === "className") {
      $el.setAttribute("class", value);
    } else {
      $el.setAttribute(key, value);
    }
  });
}
