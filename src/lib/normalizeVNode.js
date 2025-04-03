export function normalizeVNode(vNode) {
  if (
    vNode === null ||
    vNode === undefined ||
    vNode === true ||
    vNode === false
  ) {
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

    return normalizeVNode(nodeFn);
  }

  const normalizedNode = {
    ...vNode,
    children: vNode.children.map((child) => normalizeVNode(child)),
  };

  return normalizedNode;
}
