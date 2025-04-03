export function normalizeVNode(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  if (typeof vNode.type === "function") {
    const { type, props, children } = vNode;
    return normalizeVNode(type({ ...props, children }));
  }

  return {
    ...vNode,
    children: vNode.children.map(normalizeVNode).filter(Boolean),
  };
}
