// import { addEvent } from "./eventManager";

import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (
    vNode === null ||
    typeof vNode === "undefined" ||
    typeof vNode === "boolean"
  ) {
    return document.createTextNode("");
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    const child = vNode.map((item) => {
      const { type, props, children } = item;
      const tag = document.createElement(type);
      children.forEach((text) => {
        tag.appendChild(document.createTextNode(text));
      });

      updateAttributes(tag, props);

      return tag;
    });
    child.forEach((c) => fragment.appendChild(c));
    return fragment;
  }

  if (typeof vNode === "object") {
    const { type, props, children } = vNode;

    if (typeof type === "function") {
      throw new Error("function");
    } else {
      const element = document.createElement(type);
      updateAttributes(element, props);

      if (children && children.length !== 0) {
        children.forEach((child) => {
          element.appendChild(createElement(child));
        });
      }

      return element;
    }
  }

  return document.createTextNode(vNode);
}

function updateAttributes($el, props) {
  if (!props) return;
  const keys = Object.keys(props);
  keys.forEach((k) => {
    if (k === "className") {
      $el.setAttribute("class", props[k]);
      return;
    } else if (k.startsWith("on")) {
      const eventName = k.substring(2).toLowerCase();
      // $el.addEventListener(eventName, props[k]);
      addEvent($el, eventName, props[k]);
    } else {
      $el.setAttribute(k, props[k]);
    }
  });
  // 여기서 k 중에 on을 포함하는게 있으면 addEvent를 해주면 될 것 같은데
}
