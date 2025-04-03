import { appendChild, applyProps } from "../utils/dom";
import { isEmptyVNode, isTextVNode } from "../utils/vNode";

export function createElement(vNode) {
  if (isEmptyVNode(vNode)) {
    return document.createTextNode("");
  }

  if (isTextVNode(vNode)) {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();

    vNode.forEach((child) => {
      const node = createElement(child);
      fragment.appendChild(node);
    });
    return fragment;
  }

  const domElement = document.createElement(vNode.type);

  const props = vNode.props ?? {};
  const children = vNode.children ?? [];

  applyProps(domElement, props);
  appendChild(domElement, children, createElement);

  return domElement;
}
