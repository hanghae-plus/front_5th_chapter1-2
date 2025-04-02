function normalizeVNodeChildren(children) {
  return children.map((node) => normalizeVNode(node)).filter(Boolean);
}

export function normalizeVNode(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }
  if ("type" in vNode && typeof vNode.type === "function") {
    return normalizeVNode(
      vNode.type({
        ...vNode.props,
        children: normalizeVNodeChildren(vNode.children),
      }),
    );
  }

  return {
    ...vNode,
    children: normalizeVNodeChildren(vNode.children),
  };
}
