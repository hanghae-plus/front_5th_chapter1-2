export function normalizeVNode(vNode) {
  // 불리언(true/false), null, undefined인 경우 빈 문자열로 변환
  if (typeof vNode === "boolean" || vNode == null || vNode === undefined) {
    return "";
  }

  // 문자열이나 숫자는 텍스트 문자열로 변환
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  // 이미 VNode 형태인 객체 처리
  if (typeof vNode === "object") {
    // 함수형 컴포넌트 처리
    if (typeof vNode.type === "function") {
      const props = {
        ...(vNode.props || {}), // null 또는 undefined일 경우 빈 객체로 대체
        children: vNode.children,
      };
      // 컴포넌트 함수 실행
      const result = vNode.type(props);
      // 결과를 다시 정규화
      return normalizeVNode(result);
    }

    return {
      type: vNode.type,
      props: vNode.props,
      children: vNode.children.map(normalizeVNode).filter(Boolean),
    };
  }

  return "";
}
