export function normalizeVNode(vNode) {
  // null, undefined, false는 빈 문자열로 처리
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  // 숫자나 문자열은 문자열로 변환하여 반환
  if (typeof vNode === "number" || typeof vNode === "string") {
    return String(vNode);
  }

  // 배열일 경우, 모든 항목을 평탄화하고 정규화 후, falsy 값은 제거
  if (Array.isArray(vNode)) {
    return vNode
      .flat()
      .map((item) => normalizeVNode(item))
      .filter((item) => item !== null && item !== undefined && item !== false);
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

  // 객체일 경우, children이 있는지 확인하고, children을 정규화
  if (typeof vNode === "object" && vNode.children) {
    return {
      ...vNode,
      children: Array.isArray(vNode.children)
        ? vNode.children
            .map((item) => normalizeVNode(item))
            .filter(
              (item) =>
                item !== null &&
                item !== undefined &&
                item !== false &&
                item !== "",
            )
        : normalizeVNode(vNode.children),
    };

    //JSX에서 Falsy값은 아무것도 렌더링 되지않지만 빈문자열은 DOM내에서 존재할수있기 때문에 제거 해줘야함
  }

  // 기본적으로 vNode를 반환
  return vNode;
}
