export function normalizeVNode(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  if (typeof vNode === "function") {
    const vFunction = vNode();
    return normalizeVNode(vFunction);
  }

  if (vNode.children) {
    return {
      ...vNode,
      children: vNode.children.flatMap(normalizeVNode).filter(Boolean),
    };
  }

  return vNode;
}
