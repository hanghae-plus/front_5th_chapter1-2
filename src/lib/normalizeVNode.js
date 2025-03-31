export function normalizeVNode(vNode) {
  if (
    vNode === null ||
    vNode === undefined ||
    vNode === true ||
    vNode === false
  ) {
    return "";
  }

  if (typeof vNode === "number") {
    return String(vNode);
  }

  if (typeof vNode === "string") {
    return vNode;
  }

  if (vNode && typeof vNode.type === "function") {
    const Component = vNode.type;
    const props = { ...vNode.props, children: vNode.children };
    const result = Component(props);
    return normalizeVNode(result);
  }

  // 일반 가상 노드 객체 (이미 정규화되었거나 HTML 요소)
  if (vNode && vNode.type) {
    return {
      ...vNode,
      children: vNode.children ? vNode.children.map(normalizeVNode) : [],
    };
  }

  if (Array.isArray(vNode)) {
    return vNode.map(normalizeVNode);
  }

  return vNode;
}
