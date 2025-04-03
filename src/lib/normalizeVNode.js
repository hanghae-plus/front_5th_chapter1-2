export function normalizeVNode(vNode) {
  // null, undefined, false는 빈 문자열로 처리
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  // 숫자나 문자열은 문자열로 변환하여 반환
  if (typeof vNode === "number" || typeof vNode === "string") {
    return String(vNode);
  }

  // JSX 컴포넌트 처리 (컴포넌트인 경우, 호출 후 결과 정규화)
  if (typeof vNode.type === "function") {
    // 컴포넌트 인 경우
    const result = vNode.type({
      ...vNode.props, // props 객체를 펼쳐서 전달
      children: vNode.children, // 자식 요소들을 전달
    });
    return normalizeVNode(result);
  }

  // 기본적으로 vNode를 반환
  return {
    ...vNode,
    children: vNode.children
      .map(normalizeVNode)
      .filter((child) => child !== "" && child !== null && child !== undefined),
  };
}
