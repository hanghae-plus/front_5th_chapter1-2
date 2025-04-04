export function normalizeVNode(vNode) {
  if (vNode == null || typeof vNode === "boolean") return "";
  if (typeof vNode === "string") return vNode;
  if (typeof vNode === "number") return vNode.toString();

  if (typeof vNode.type === "function") {
    const component = vNode.type({
      ...vNode.props,
      children: vNode.children,
    });

    return normalizeVNode(component);
  }
  return {
    type: vNode.type,
    props: vNode.props,
    children: Array.isArray(vNode.children)
      ? vNode.children.map(normalizeVNode).filter((node) => node != "")
      : vNode.children,
  };
}
