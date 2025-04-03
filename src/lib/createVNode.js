export function createVNode(type, props, ...children) {
  const nextChildren = children
    .flat(Infinity)
    .filter((child) => child !== false)
    .filter((child) => child !== null)
    .filter((child) => child !== undefined)
    .filter((child) => child !== true);

  return {
    type,
    props,
    children: nextChildren,
  };
}
