const isEmptyNode = (vNode) =>
  vNode === null || vNode === undefined || vNode === false || vNode === true;

export function normalizeVNode(vNode) {
  if (isEmptyNode(vNode)) return "";

  if (typeof vNode === "string" || typeof vNode === "number")
    return String(vNode);

  if (typeof vNode.type === "function")
    return normalizeVNode(
      vNode.type({ ...vNode.props, children: vNode.children }),
    );

  if (typeof vNode.type === "string") {
    const normalizedNode = {
      type: vNode.type,
      props: vNode.props === undefined ? {} : vNode.props,
      children: [],
    };

    if (vNode.children) {
      const children = Array.isArray(vNode.children)
        ? vNode.children
        : [vNode.children];

      normalizedNode.children = children
        .map((child) => normalizeVNode(child))
        .filter((child) => child !== "");
    }

    return normalizedNode;
  }

  return vNode;
}
