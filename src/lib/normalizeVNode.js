export function normalizeVNode(vNode) {
  // 1. null, undefined, boolean 값은 빈 문자열로 변환되어야 한다.
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  // 2. 문자열과 숫자는 문자열로 변환되어야 한다.
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  // 3. 컴포넌트를 정규화한다.
  if (typeof vNode.type === "function") {
    const props = {
      ...(vNode.props || {}),
      children: vNode.children, // childrend을 다시 넘겨서 재귀
    };
    const rendered = vNode.type(props);

    return normalizeVNode(rendered);
  }

  // 3-2. 자식 요소 정규화 + Falsy 값 처리
  if (vNode.children) {
    vNode.children = vNode.children
      .map((child) => normalizeVNode(child)) // 각 자식을 정규화
      .filter((child) => child !== ""); // 빈 문자열(falsy값) 제거
  }

  return vNode;
}
