function transformCreateNode(children) {
  return children
    .flat(Infinity)
    .filter((v) => v !== null && v !== undefined && v !== false && v !== true);
}

export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: transformCreateNode(children),
  };
}
