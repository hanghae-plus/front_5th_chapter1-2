export function normalizeVNode(vNode) {
  // 1. null, undefined, boolean 값 처리
  // null == undefined
  if (vNode == null || typeof vNode === "boolean") {
    return "";
  }

  // 2. 기본 타입(문자열, 숫자) 처리
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  // 3. 배열 처리
  // Boolean()
  if (Array.isArray(vNode)) {
    return vNode
      .flat() // 배열 펼치기
      .map(normalizeVNode) // 각 요소 정규화
      .filter(Boolean); // 빈 문자열 제거
  }

  // 4. 컴포넌트 함수 처리
  if (typeof vNode.type === "function") {
    const props = {
      ...vNode.props, // 기존 props 펼침
      children: vNode.children, // children 속성 추가
    };
    return normalizeVNode(vNode.type(props)); // 컴포넌트 실행 후 결과 정규화
  }

  // 5. 일반 엘리먼트 처리
  const normalizedChildren = Array.isArray(vNode.children)
    ? vNode.children.map(normalizeVNode).filter(Boolean)
    : vNode.children;

  return {
    type: vNode.type,
    props: vNode.props,
    children: normalizedChildren,
  };
}
