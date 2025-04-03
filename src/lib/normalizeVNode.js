export function normalizeVNode(vNode) {
  // boolean, undefined, null 처리
  if (typeof vNode === "boolean" || vNode == null) {
    return "";
  }

  // 문자열, 숫자 -> 문자열로 변환
  if (typeof vNode !== "object") {
    return String(vNode);
  }

  // 함수형 컴포넌트(커스텀 컴포넌트) 처리
  // children을 props로 보내기 ..?
  if (typeof vNode.type === "function") {
    const Component = vNode.type;
    const props = { ...vNode.props, children: vNode.children || [] };

    return normalizeVNode(Component(props));
  }

  // 일반 HTML 요소 처리
  if (typeof vNode.type === "string") {
    const { type, props } = vNode;
    const normalizedChildren = (vNode.children || [])
      .map((child) => normalizeVNode(child))
      .filter((child) => child !== "");

    return {
      type,
      props,
      children: normalizedChildren,
    };
  }

  // 그 외에는 그대로 반환
  return vNode;
}
