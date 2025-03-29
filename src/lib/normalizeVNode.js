export function normalizeVNode(vNode) {
  // console.log(vNode);
  // 랜더링 제외 / 텍스트 노드 처리
  const is = (type) => typeof vNode === type;
  if (vNode === null || vNode === undefined || is("boolean")) return "";
  else if (is("number") || is("string")) return String(vNode);

  // 컴포넌트 정규화
  const normalizeChildren = (children) =>
    (children || []).map(normalizeVNode).filter((c) => c !== "");
  if (typeof vNode.type === "function") {
    return normalizeVNode(
      vNode.type({
        ...vNode.props,
        children: normalizeChildren(vNode.children),
      }),
    );
  }
  return {
    type: vNode.type,
    props: vNode.props ?? null,
    children: normalizeChildren(vNode.children),
  };
}
