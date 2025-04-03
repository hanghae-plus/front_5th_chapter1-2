export function normalizeVNode(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  if (typeof vNode.type === "function") {
    const component = vNode.type;
    const props = vNode.props;
    return normalizeVNode(
      component({ ...props, children: vNode.children || [] }),
    );
  }
  if (Array.isArray(vNode.children)) {
    const children = normalizeVNode(vNode.children)
      .map((v) => normalizeVNode(v))
      .filter((v) => v !== "");
    return { ...vNode, children: children };
  }
  return vNode;
}
