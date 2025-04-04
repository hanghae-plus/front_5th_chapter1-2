export function normalizeVNode(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean")
    return "";

  if (typeof vNode === "string" || typeof vNode === "number")
    return String(vNode);

  if (vNode.children) {
    vNode.children = vNode.children.map(normalizeVNode).filter(Boolean);
  }

  if (typeof vNode.type === "function") {
    const normalized = normalizeVNode(vNode.type(vNode.props ?? {}));

    return {
      ...normalized,
      children: [...(normalized.children ?? []), ...vNode.children],
    };
  }

  return vNode;
}
