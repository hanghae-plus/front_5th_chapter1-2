export function normalizeVNode(vNode) {
  // 1. null, undefined, boolean 타입인 경우 빈 문자열 반환
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  // 2. 문자열이나 숫자인 경우 문자열로 변환하여 반환
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  const normalizeChildren = (children) => {
    return children
      .map((child) => normalizeVNode(child))
      .filter((child) => child !== null && child !== undefined && child !== "");
  };

  // 3. 함수형 컴포넌트
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
