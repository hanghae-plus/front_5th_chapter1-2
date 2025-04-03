export function createVNode(type, props, ...children) {
  // 렌더링이 가능한 요소만 필터링
  // Boolean(v)는 Falsy값을 제거함 (false, null, undefined, 0, "", NaN)
  const renderAbleNode = children
    .flat(Infinity)
    .filter((v) => v === 0 || Boolean(v));

  return {
    type,
    props,
    children: renderAbleNode,
  };
}
