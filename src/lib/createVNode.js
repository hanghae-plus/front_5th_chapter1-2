export function createVNode(type, props, ...children) {
  // 자식은 평탄화 해야한다.
  children = children.flat(Infinity);
  // 랜더링 하지 않아야 할 것들을 예외한다.
  children = children.filter(
    (c) => c !== false && c !== null && c !== undefined && c !== true,
  );
  return { type, props, children };
}
