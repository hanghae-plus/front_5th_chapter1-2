/*
 * 가상 DOM 노드를 정규화하는 함수
 * 함수형 컴포넌트를 실행하고 기본 타입을 변환하여 일관된 형태로 만든다.
 * */
export function normalizeVNode(vNode) {
  // null, undefined, boolean 값은 빈 문자열로 변환
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  // 문자열로 변환
  if (typeof vNode === "number" || typeof vNode === "string") {
    return String(vNode);
  }

  if (typeof vNode.type === "function") {
    const { type, props, children } = vNode;
    return normalizeVNode(type({ ...props, children }));
  }

  // 새로운 정규화 된 vNode 반환
  return {
    ...vNode,
    children: vNode.children.map(normalizeVNode).filter(Boolean),
  };
}
