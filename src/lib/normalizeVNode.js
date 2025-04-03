export function normalizeVNode(vNode) {
  const falsyType = ["undefined", "boolean"];

  if (falsyType.includes(typeof vNode) || vNode === null) {
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
    children: vNode.children
      .filter((child) => !falsyType.includes(typeof child) && child !== null)
      .map((child) => normalizeVNode(child)),
  };

  return normalizedNode;
}
