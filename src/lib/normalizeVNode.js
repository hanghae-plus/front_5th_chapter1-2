export function normalizeVNode(vNode) {
  // vNode가 null, boolean, undefined인 경우 빈 문자열 반환
  if (
    vNode == null ||
    typeof vNode === "boolean" ||
    typeof vNode === "undefined"
  ) {
    return "";
  }

  // vNode가 문자열 또는 숫자인 경우 문자열로 변환하여 반환
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  // vNode의 타입이 함수인 경우, 해당 함수로 호출하여 반환된 결과를 재귀적으로 표준화
  if (typeof vNode.type === "function") {
    return normalizeVNode(
      vNode.type({
        ...vNode.props,
        children: vNode.children,
      }),
    );
  }

  // vNode의 자식이 배열인 경우, 자식 노드를 재귀적으로 정규화하고 null이 아닌 것만 필터링
  if (Array.isArray(vNode.children)) {
    vNode.children = vNode.children
      .map(normalizeVNode)
      .filter((v) => v !== null && v !== undefined && v !== false && v !== "");
  }

  return vNode;
}
