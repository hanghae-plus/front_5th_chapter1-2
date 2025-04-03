export function createVNode(type, props, ...children) {
  // 평탄화
  const flattedChildren = children.flat?.() || [].concat(...children);

  // falsy 제거
  const falsy = [null, undefined, false];
  const filteredChildren = flattedChildren.filter(
    (child) => !falsy.includes(child),
  );

  return {
    type,
    props,
    children: [...filteredChildren].flat(),
  };
}
