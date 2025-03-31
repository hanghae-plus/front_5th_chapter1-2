export function normalizeVNode(vNode) {
  //null, undefined, boolean -> 빈 문자열로 변환
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  //문자열, 숫자 -> 문자열로 변환
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  //TODO 컴포넌트 정규화
  if (typeof vNode === "function") {
    const node = vNode.type({ ...vNode.props, children: vNode.children });
    return normalizeVNode(node);
  }

  return {
    ...vNode,
    children: vNode.children
      .flatMap(normalizeVNode)
      .filter((item) => Boolean(item)),
  };
}
