export function normalizeVNode(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  // 정규화
  const normalizeChildren = (children) => {
    return children
      .map((child) => normalizeVNode(child))
      .filter((child) => child !== null && child !== undefined && child !== "");
  };

  // 함수형 컴포넌트
  if (typeof vNode.type === "function") {
    const normalizedChildren = normalizeChildren(vNode.children);

    const props = {
      ...(vNode.props || {}),
      children: normalizedChildren,
    };

    // 컴포넌트 함수 호출 후 결과 정규화
    const result = vNode.type(props);
    return normalizeVNode(result);
  }

  const normalizedChildren = normalizeChildren(vNode.children);

  return {
    ...vNode,
    children: normalizedChildren,
  };
}
