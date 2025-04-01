import { appendChild, applyProps } from "../utils/dom";

export function createElement(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();

    vNode.forEach((child) => {
      const node = createElement(child);

      if (node instanceof Node) {
        fragment.appendChild(node);
      }
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
