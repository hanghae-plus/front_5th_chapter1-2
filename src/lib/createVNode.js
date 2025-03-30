export function createVNode(type, props, ...children) {
  const flattenChildren = (arr) => {
    return arr.reduce((flat, item) => {
      if (!item && item !== 0) return flat;
      return flat.concat(Array.isArray(item) ? flattenChildren(item) : item);
    }, []);
  };

  return {
    type,
    props,
    children: flattenChildren(children),
  };
}
