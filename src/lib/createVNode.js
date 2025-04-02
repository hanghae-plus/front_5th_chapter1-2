export function createVNode(type, props, ...children) {
  const flattenChildren = (childArr) => {
    return childArr.reduce((result, child) => {
      if (Array.isArray(child)) {
        return [...result, ...flattenChildren(child)];
      }

      if (child === null || child === undefined || typeof child === "boolean") {
        return result;
      }
      return [...result, child];
    }, []);
  };

  const flatChild = flattenChildren(children);

  return {
    type,
    props,
    children: flatChild,
  };
}
