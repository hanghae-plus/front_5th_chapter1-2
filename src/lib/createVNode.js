export function createVNode(type, props, ...children) {
  const flattenedChildren = children
    .flat(Infinity)
    .filter((child) => child !== null && child !== false);

  return { type, props: props ?? null, children: flattenedChildren };
}
