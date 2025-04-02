export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: children
      .flat(2)
      .filter((v) => v !== null && v !== undefined && v !== false),
  };
}
