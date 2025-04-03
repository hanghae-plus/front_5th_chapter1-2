export function createVNode(type, props, ...children) {
  const flattedChildren = children
    .flat(Infinity)
    .filter(
      (child) => child !== null && child !== undefined && child !== false,
    );

  return {
    type,
    props: props ?? null,
    children: flattedChildren,
  };
}
