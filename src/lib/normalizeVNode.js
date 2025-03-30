export function normalizeVNode(vNode) {
  if (vNode === null || typeof vNode === "boolean" || vNode === undefined) {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  if (typeof vNode.type === "function") {
    const component = vNode.type({
      ...vNode.props,
      children: vNode.children,
    });
    return normalizeVNode(component);
  }

  if (Array.isArray(vNode)) {
    return vNode.flatMap(normalizeVNode).filter(Boolean);
  }

  return {
    ...vNode,
    children: vNode.children.flatMap(normalizeVNode).filter(Boolean),
  };
}
