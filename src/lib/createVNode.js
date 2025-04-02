const flattenChildren = (children) => {
  return children.flatMap((child) => {
    if (child === null || child === undefined || child === false) return [];

    if (Array.isArray(child)) {
      return flattenChildren(child);
    }
    return child;
  });
};

export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: flattenChildren(children),
  };
}
