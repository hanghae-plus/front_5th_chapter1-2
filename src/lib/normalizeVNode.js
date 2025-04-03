export function normalizeVNode(vNode) {
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  if (typeof vNode === "boolean" || vNode === null || vNode === undefined) {
    return "";
  }

  if (typeof vNode.type === "function") {
    return normalizeVNode(
      vNode.type({ ...vNode.props, children: vNode.children }),
    );
  }

  return {
    type: vNode.type,
    props: vNode.props || null,
    children: Array.isArray(vNode.children)
      ? vNode.children.map(normalizeVNode).filter((node) => node !== "")
      : vNode.children,
  };
}
