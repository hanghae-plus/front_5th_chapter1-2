export function normalizeVNode(vNode) {
  if (vNode === undefined || vNode === null || typeof vNode === "boolean") {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return `${vNode}`;
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
