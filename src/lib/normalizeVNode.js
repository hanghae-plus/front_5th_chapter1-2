export const isNotFalsy = (el) =>
  el !== null && el !== undefined && typeof el !== "boolean";

export function normalizeVNode(vNode) {
  if (!isNotFalsy(vNode)) {
    return "";
  }

  if (typeof vNode === "number" || typeof vNode === "string") {
    return String(vNode);
  }

  if (typeof vNode.type === "function") {
    const { type, props, children } = vNode;
    // 컴포넌트 호출
    const component = type({
      ...props, // 불변성
      children,
    });
    return normalizeVNode(component); // 재귀
  }

  // children 정리
  return {
    ...vNode,
    children: vNode.children
      ? vNode.children.filter(isNotFalsy).map(normalizeVNode) // 자식 노드
      : [], // undefined 일 경우 렌더링 제외
  };
}
