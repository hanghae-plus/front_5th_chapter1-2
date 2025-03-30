export function normalizeVNode(vNode) {
  if (
    vNode === null ||
    typeof vNode === "undefined" ||
    typeof vNode === "boolean"
  ) {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  if (Array.isArray(vNode)) {
    return vNode.map(normalizeVNode).filter((node) => node !== "");
  }

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
    children: normalizeVNode(vNode.children),
  };
}
