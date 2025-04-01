export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: children.flat(10).filter((v) => v === 0 || Boolean(v)),
  };
}
