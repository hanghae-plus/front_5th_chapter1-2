export function normalizeVNode(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  if (typeof vNode.type === "function") {
    const renderedNode = vNode.type({
      ...vNode.props,
      children: vNode.children,
    });
    return normalizeVNode(renderedNode);
  }

  let normalizedChildren = [];
  if (vNode.children) {
    normalizedChildren = vNode.children
      .filter((child) => child !== null && typeof child !== "boolean")
      .map((child) => {
        if (typeof child === "object") {
          return normalizeVNode(child);
        } else {
          return child;
        }
      });
  }

  return { ...vNode, children: normalizedChildren };
}
