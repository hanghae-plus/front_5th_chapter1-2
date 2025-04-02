export function normalizeVNode(vNode) {
  // null, undefined, true, false는 빈 문자열로 변환
  if (
    vNode === null ||
    vNode === undefined ||
    vNode === true ||
    vNode === false
  ) {
    return "";
  }

  // 문자열이나 숫자는 문자열로 변환하여 반환
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  // 컴포넌트 처리 (함수형 컴포넌트)
  if (typeof vNode.type === "function") {
    const Component = vNode.type;
    const props = { ...vNode.props };
    const children = vNode.children || [];

    // 컴포넌트 호출하여 렌더링 결과 가져오기
    const rendered = Component({ ...props, children });

    // 렌더링 결과도 정규화
    return normalizeVNode(rendered);
  }

  // 일반 vNode 처리 (div, span 등의 HTML 요소)
  if (vNode.children) {
    // 자식 노드들을 정규화하고 falsy 값 제거
    const normalizedChildren = Array.isArray(vNode.children)
      ? vNode.children.flatMap((child) => {
          const normalized = normalizeVNode(child);
          // Falsy 값 (null, undefined, false)은 제거
          return normalized === "" ? [] : [normalized];
        })
      : [normalizeVNode(vNode.children)].filter((child) => child !== "");

    return {
      ...vNode,
      children: normalizedChildren,
    };
  }

  // 그 외 케이스는 그대로 반환
  return vNode;
}
