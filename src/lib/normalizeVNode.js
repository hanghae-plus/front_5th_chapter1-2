// JSX 기반의 렌더링 시스템에서 "불필요한 값"이나 "불완전한 노드"를 정리(clean-up)하는 역할
//특히 JSX에 포함된 조건문, 숫자, 불린 값 등을 올바르게 처리하는 데 필수!
export function normalizeVNode(vNode) {
  if (vNode == null || typeof vNode === "boolean") return "";

  if (typeof vNode === "string" || typeof vNode === "number") {
    return {
      type: "TEXT_ELEMENT",
      props: {},
      children: [],
      nodeValue: String(vNode),
    };
  }

  if (typeof vNode !== "object") {
    return {
      type: "TEXT_ELEMENT",
      props: {},
      children: [],
      nodeValue: String(vNode),
    };
  }

  if (typeof vNode.type === "function") {
    const nextVNode = vNode.type(vNode.props || {});
    return normalizeVNode(nextVNode);
  }

  const normalizedChildren = [];
  (vNode.children || []).forEach((child) => {
    const normalized = normalizeVNode(child);
    if (normalized !== null && normalized !== undefined) {
      normalizedChildren.push(normalized);
    }
  });

  return {
    ...vNode,
    children: normalizedChildren,
  };
}
