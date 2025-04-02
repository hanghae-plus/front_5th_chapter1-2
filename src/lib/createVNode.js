export function createVNode(type, props, ...children) {
  children = children.filter(
    (child) => child !== null && child !== undefined && child !== false,
  );
  return {
    type,
    props,
    children: children.flat(Infinity),
  };
}
