export function createVNode(type, props, ...children) {
  const fillteringChildren = children.filter(
    (child) => child !== null && child !== undefined && child !== false,
  );

  return {
    type,
    props,
    children: fillteringChildren.flat(Infinity),
  };
}
