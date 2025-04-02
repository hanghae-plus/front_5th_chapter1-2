export function normalizeVNode(vNode) {
  // 기본 값 처리
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  // 원시 타입 처리
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  return {
    type: vNode.type,
    props: vNode.props || {},
    children: vNode.children,
  };
}
