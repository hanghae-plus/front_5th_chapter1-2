export function normalizeVNode(vNode) {
  if (vNode == null || typeof vNode === "boolean") {
    return "";
  }
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }
  if (typeof vNode.type === "function") {
    const node = vNode.type({ ...vNode.props, children: vNode.children });
    return normalizeVNode(node);
  } else {
    return {
      ...vNode,
      children: vNode.children
        .flatMap(normalizeVNode)
        .filter((item) => Boolean(item)),
    };
  }
}
