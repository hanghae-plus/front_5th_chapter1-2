export function createVNode(type, props, ...children) {
  // 자식 배열을 평탄화하고 null, undefined, false 등은 제외
  const flattenedChildren = children
    .flat(Infinity)
    .filter((item) => item !== null && item !== undefined && item !== false);
  // flat(Infinity)는 중첩된 배열이 몇 단계가 있든지 모든 배열을 평탄화함

  return { type, props, children: flattenedChildren };
}
