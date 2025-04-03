export function normalizeVNode(vNode) {
  // 랜더링 제외 / 텍스트 노드 처리
  const is = (type) => typeof vNode === type;
  if (vNode === null || vNode === undefined || is("boolean")) return "";
  else if (is("number") || is("string")) return String(vNode);

  // 컴포넌트 정규화
  // Function TestComponent로 함수형 컴포넌트가 넘어오는 경우가 있음
  if (typeof vNode.type === "function") {
    const { type, props = {}, children = [] } = vNode;
    return normalizeVNode(type({ ...props, children }));
  }
  const normalizeChildren = (children) =>
    (children || []).map(normalizeVNode).filter((c) => c !== "");
  return {
    type: vNode.type,
    props: vNode.props ?? null,
    children: normalizeChildren(vNode.children),
  };
}
