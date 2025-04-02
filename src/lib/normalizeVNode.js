export function normalizeVNode(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number")
    return String(vNode);

  if (typeof vNode.type === "function") {
    const result = vNode.type({
      ...(vNode.props || {}),
      children: vNode.children,
    });
    return normalizeVNode(result);
  }

  const { type, props = {}, children = [] } = vNode;

  const normalizedChildren = (Array.isArray(children) ? children : [children])
    .flat(Infinity)
    .map((child) => normalizeVNode(child))
    .filter((child) => child !== "");

  return {
    type,
    props,
    children: normalizedChildren,
  };
}
