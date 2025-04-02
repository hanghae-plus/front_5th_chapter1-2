export function createVNode(type, props, ...children) {
  const flattenChildren = children
    .flat(Infinity)
    .filter(
      (child) => child !== false && child !== null && child !== undefined,
    );

  return {
    type: type,
    props: props || null,
    children: flattenChildren,
  };
}
