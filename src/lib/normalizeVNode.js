export function normalizeVNode(vNode) {
  // null, undefined, boolean 처리
  if (
    vNode === null ||
    typeof vNode === "undefined" ||
    typeof vNode === "boolean"
  ) {
    return "";
  }

  // 문자열이나 숫자는 그대로 반환
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  // 배열 처리 (중첩된 배열도 평탄화)
  if (Array.isArray(vNode)) {
    return vNode
      .flat() // 배열 내 중첩된 배열을 평탄화
      .map(normalizeVNode) // 재귀적으로 정규화
      .filter((child) => child !== null && child !== undefined && child !== ""); // 빈 값은 제거
  }

  // 함수형 컴포넌트 처리
  if (typeof vNode.type === "function") {
    // 자식과 속성을 넣어서 컴포넌트를 실행
    const renderedVNode = vNode.type({
      ...vNode.props,
      children: vNode.children,
    });
    return normalizeVNode(renderedVNode); // 렌더링된 VNode를 다시 정규화
  }

  // 객체 처리
  return {
    type: vNode.type,
    props: vNode.props || null, // props가 없으면 빈 객체로 처리
    children: Array.isArray(vNode.children)
      ? vNode.children
          .map(normalizeVNode) // 자식 노드들을 재귀적으로 정규화
          .filter((node) => node !== "") // 빈 값은 제거
      : vNode.children, // 자식이 없을 경우 그대로 반환
  };
}
