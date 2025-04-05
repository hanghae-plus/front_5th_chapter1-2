import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (vNode === undefined || vNode === null || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  if (Array.isArray(vNode)) {
    const fragment = {
      nodeType: Node.DOCUMENT_FRAGMENT_NODE,
      childNodes: [],
    };
    vNode.forEach((child) => {
      fragment.childNodes.push(document.createElement(child.type));
    });
    return fragment;
  }

  if (typeof vNode.type === "function") {
    throw new Error();
  }

  const $el = document.createElement(vNode.type);
  if (vNode.props) {
    Object.entries(vNode.props).forEach(([key, value]) => {
      if (key === "className") {
        $el.setAttribute("class", value);
      } else if (key.startsWith("on")) {
        addEvent($el, key.slice(2).toLowerCase(), value);
      } else {
        $el.setAttribute(key, value);
      }
    });
  }
  vNode.children.forEach((child) => {
    $el.appendChild(createElement(child));
  });

  return $el;
}

function updateAttributes($el, props) {}
