export function normalizeVNode(vNode) {
  // 1. vNode가 null, undefined 또는 boolean 타입일 경우 빈 문자열을 반환합니다.
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  // 2. vNode가 문자열 또는 숫자일 경우 문자열로 변환하여 반환합니다.
  // 다른방법: 템플릿 리터럴 -> 성능 측면에서 String() 이 더 빠르다.
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  // 3. vNode의 타입이 함수일 경우 해당 함수를 호출하여 반환된 결과를 재귀적으로 표준화합니다.
  if (typeof vNode.type === "function") {
    const Component = vNode.type;

    // props가 없을 경우
    // -> cursor가 자동생성
    const props = { ...(vNode.props || {}) };

    // props.children 없을 경우
    // props.children가 있을 경우 우선 사용
    // -> cursor가 자동생성
    if (!props.children && vNode.children && vNode.children.length > 0) {
      props.children = vNode.children;
    }

    return normalizeVNode(Component(props));
  }

  return {
    type: vNode.type,
    props: vNode.props,
    children: vNode.children.map(normalizeVNode).filter((node) => node !== ""),
  };
}
