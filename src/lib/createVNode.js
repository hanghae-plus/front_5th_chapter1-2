export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: children
      .flat(Number.POSITIVE_INFINITY)
      .filter((v) => Boolean(v) || v === 0),
  };
}
