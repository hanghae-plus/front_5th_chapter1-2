import { createVNode, getFlattenChildren } from "./createVNode.js";
import { isEmpty, isPrimitive, isFunctionComponent } from "./utils.js";

export function normalizeVNode(vNode) {
  if (isEmpty(vNode)) return handleEmpty(vNode);
  else if (isPrimitive(vNode)) return handlePrimitive(vNode);
  else if (Array.isArray(vNode)) return handleArray(vNode);
  else if (isFunctionComponent(vNode)) return handleFunctionComponent(vNode);
  else return handleElement(vNode);
}

function handleEmpty() {
  return "";
}

function handlePrimitive(vNode) {
  return `${vNode}`;
}

function handleArray(vNode) {
  return getFlattenChildren(vNode.map(normalizeVNode));
}

function handleFunctionComponent(vNode) {
  const renderedVNode = vNode.type({
    ...vNode.props,
    children: vNode.children,
  });
  return normalizeVNode(renderedVNode);
}

function handleElement(vNode) {
  const children = Array.isArray(vNode.children)
    ? vNode.children.map(normalizeVNode)
    : [normalizeVNode(vNode.children)];

  return createVNode(vNode.type, vNode.props, ...children);
}
