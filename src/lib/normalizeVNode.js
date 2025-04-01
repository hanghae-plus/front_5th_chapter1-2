export function normalizeVNode(vNode) {
  const inValidValues = [null, undefined, true, false, ""];
  if (inValidValues.includes(vNode)) {
    return "";
  }

  const isPrimitive = typeof vNode === "string" || typeof vNode === "number";
  if (isPrimitive) {
    return String(vNode);
  }

  /**
   * 컴포넌트인 경우 - type으로 컴포넌트가 전달
   */
  if (typeof vNode.type === "function") {
    const props = {
      ...vNode.props,
      children: vNode.children,
    };
    const componentResult = vNode.type(props);

    // 컴포넌트 결과가 createVNode로 변환된 형태일 것이므로
    // type이 문자열인 경우의 처리와 동일하게 처리
    if (typeof componentResult.type === "string") {
      const normalizedProps = componentResult.props || {};
      const normalizedChildren = Array.isArray(componentResult.children)
        ? componentResult.children.map(normalizeVNode)
        : normalizeVNode(componentResult.children);

      return {
        type: componentResult.type,
        props: normalizedProps,
        children: normalizedChildren,
      };
    }

    // 만약 결과가 여전히 컴포넌트라면 재귀적으로 처리
    return normalizeVNode(componentResult);
  }

  // 일반 DOM 엘리먼트 처리
  if (typeof vNode.type === "string") {
    const props = vNode.props;

    const children = Array.isArray(vNode.children)
      ? vNode.children.map(normalizeVNode)
      : normalizeVNode(vNode.children);

    return {
      type: vNode.type,
      props: props,
      children: children?.filter((v) => !inValidValues.includes(v)) || [],
    };
  }

  return "";
}
