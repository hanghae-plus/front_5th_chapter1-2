export function normalizeVNode(vNode) {
  // vNode가 null, undefined 또는 boolean 타입일 경우 빈 문자열을 반환합니다.
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }
  // vNode가 문자열 또는 숫자일 경우 문자열로 변환하여 반환합니다.
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }
  // vNode의 타입이 함수일 경우 해당 함수를 호출하여 반환된 결과를 재귀적으로 표준화합니다.
  if (typeof vNode.type === "function") {
    const props = { ...(vNode.props || {}), children: vNode.children };
    return normalizeVNode(vNode.type(props));
  }

  // vNode.children이 배열이 아닐 경우 배열로 변환
  let children = []; // vNode.children이 없을 경우 방지
  if (vNode.children) {
    children = Array.isArray(vNode.children)
      ? vNode.children
      : [vNode.children];
  }

  // 그 외의 경우, vNode의 자식 요소들을 재귀적으로 표준화하고, null 또는 undefined 값을 필터링하여 반환합니다.
  const normalizedChildren = children
    .map((child) => normalizeVNode(child))
    .filter(
      (child) =>
        child !== "" &&
        child !== null &&
        child !== undefined &&
        child !== false,
    ); // Falsy 값 (null, undefined, false, 빈 문자열 "")을 필터링

  return { ...vNode, children: normalizedChildren };
}
