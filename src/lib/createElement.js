// import { addEvent } from "./eventManager";
import { inValidValues } from "./shared.js";

function addChildren(parent, children) {
  const childrenNodes = children.map(createElement);
  childrenNodes.map((v) => parent.appendChild(v));
}

function setAttribute(target, props) {
  const propsArray = Object.entries(props || {});
  propsArray.forEach(([key, value]) =>
    target.setAttribute(key === "className" ? "class" : key, value),
  );
}

export function createElement(vNode) {
  if (inValidValues.includes(vNode)) {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode)) {
    const docFragment = document.createDocumentFragment();
    const children = vNode.map(createElement);
    children.map((v) => docFragment.appendChild(v));

    return docFragment;
  }

  const elem = document.createElement(vNode.type);
  setAttribute(elem, vNode.props);
  addChildren(elem, vNode.children);
  return elem;
}

// function updateAttributes($el, props) {}
