export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: children
      .flat(Infinity)
      .filter((c) => c !== null && c !== undefined && c !== false),
  };
}
