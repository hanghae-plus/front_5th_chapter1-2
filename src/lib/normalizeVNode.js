export function normalizeVNode(vNode) {
  if (
    vNode === null ||
    typeof vNode === "undefined" ||
    typeof vNode === "boolean"
  ) {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return vNode.toString();
  }

  if (typeof vNode.type === "function") {
    const propsWithChildren = {
      ...vNode.props,
      children: vNode.props?.children || vNode.children,
    };

    return normalizeVNode(vNode.type(propsWithChildren));
  }

  // 일반적인 vNode 객체인 경우 children을 재귀적으로 처리
  // 위에서 falsy한 값 ""로 return -> 빈 문자열은 filtering 되어야 함
  if (vNode.children) {
    if (Array.isArray(vNode.children)) {
      vNode.children = vNode.children
        .map((child) => normalizeVNode(child))
        .filter((child) => child !== "");
    } else {
      const normalizedChild = normalizeVNode(vNode.children);
      vNode.children = normalizedChild !== "" ? normalizedChild : null;
    }
  }

  // 최종적으로 변환된 vNode 객체를 반환
  return vNode;
}
