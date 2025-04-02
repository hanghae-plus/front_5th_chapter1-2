export function normalizeVNode(vNode) {
  const type = typeof vNode;

  if (type === "boolean" || type === "undefined" || vNode === null) {
    return "";
  }

  if (type === "string" || type === "number") {
    return vNode.toString();
  }

  if (Array.isArray(vNode)) {
    return vNode
      .map(normalizeVNode)
      .filter((child) => child !== null && child !== undefined && child !== "");
  }

  if (vNode && typeof vNode === "object") {
    // 자식 요소를 재귀적으로 표준화
    if (vNode.children) {
      vNode.children = normalizeVNode(vNode.children);
    }

    // 함수형 컴포넌트 표준화
    if (typeof vNode.type === "function") {
      const componentVNode = vNode.type({
        ...vNode.props,
        children: vNode.children,
      });

      if (componentVNode === null || componentVNode === undefined) {
        return "";
      }

      if (Array.isArray(componentVNode)) {
        return componentVNode.flatMap(normalizeVNode);
      }

      return normalizeVNode(componentVNode);
    }
  }

  return vNode;
}
