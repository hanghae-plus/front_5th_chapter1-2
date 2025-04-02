export function normalizeVNode(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  } else if (typeof vNode === "string") {
    return vNode;
  } else if (typeof vNode === "number") {
    return vNode.toString();
  }

  // 정규화
  if (typeof vNode.type === "function") {
    const nodeFn = vNode.type({
      children: vNode.children,
      ...vNode.props,
    });

    nodeFn.props = {
      ...(vNode.props || {}),
      ...(nodeFn.props || {}),
    };

    nodeFn.children = nodeFn.children.map((node) => normalizeVNode(node));
    return normalizeVNode(nodeFn);
  }

  return vNode;
}
