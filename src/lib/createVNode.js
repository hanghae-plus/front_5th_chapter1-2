export function createVNode(type, props, ...children) {
  children = children
    .flat(Infinity)
    .filter((son) => son != null && son !== false);
  return { type, props, children };
}
