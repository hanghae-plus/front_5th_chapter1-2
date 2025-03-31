export function normalizeVNode(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  if (typeof vNode.type === "function") {
    const result = vNode.type({
      ...vNode.props,
      children: normalizeChildren(vNode.children),
    });
    return normalizeVNode(result);
  }

  function normalizeChildren(children) {
    if (Array.isArray(children)) {
      return children
        .map((child) => normalizeVNode(child))
        .filter((child) => child !== null && child !== "");
    }
    return children !== null ? [normalizeVNode(children)] : [];
  }

  return {
    ...vNode,
    children: normalizeChildren(vNode.children),
  };
}
