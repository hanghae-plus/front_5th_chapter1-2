export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: children
      .flat(Infinity)
      .filter((node) => node !== null && node !== undefined && node !== false),
  };
}
