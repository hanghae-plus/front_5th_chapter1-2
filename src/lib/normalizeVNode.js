export function normalizeVNode(vNode) {
  // 1. 기본 타입 처리: null, undefined, boolean -> 빈 문자열
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  // 2. 원시 타입 처리: string, number -> 문자열
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  // 3. 배열 처리: 각 요소를 정규화하고 빈 문자열 제거
  if (Array.isArray(vNode)) {
    return vNode
      .flat()
      .map(normalizeVNode)
      .filter((node) => node !== "");
  }

  // 4. 컴포넌트 처리: 컴포넌트 함수를 실행하고 결과를 정규화
  if (typeof vNode.type === "function") {
    return normalizeVNode(
      vNode.type({
        ...vNode.props,
        children: vNode.children,
      }),
    );
  }

  // 5. 일반 엘리먼트의 자식 노드 처리
  return {
    type: vNode.type,
    props: vNode.props,
    children: vNode.children.map(normalizeVNode).filter(Boolean),
  };
}
