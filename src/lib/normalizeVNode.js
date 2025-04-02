export function normalizeVNode(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  if (typeof vNode.type === "function") {
    const props = { ...(vNode.props || {}), children: vNode.children };
    return normalizeVNode(vNode.type(props));
  }

  const normalizedChildren = vNode.children.map(normalizeVNode);

  return { ...vNode, children: normalizedChildren };
}
