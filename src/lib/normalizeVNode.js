export function normalizeVNode(vNode) {
  console.log(vNode);
  if (vNode == null || typeof vNode === "boolean") {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return vNode.toString();
  }

  // 함수형 컴포넌트의 경우 함수를 실행시킨다
  // 단, 실행할 때 props 전달해줘야 함
  if (typeof vNode.type === "function") {
    const childComponent = vNode.type({
      ...vNode.props,
      children: vNode.children,
    });

    return normalizeVNode(childComponent);
  }

  // 함수가 아닌 요소
  return {
    type: vNode.type,
    props: vNode.props,
    children: Array.isArray(vNode.children)
      ? vNode.children.map(normalizeVNode).filter((node) => node != "") // falsy 처리
      : vNode.children,
  };
}
