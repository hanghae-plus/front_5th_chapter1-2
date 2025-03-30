export function createVNode(type, props, ...children) {
  const flatChildren = children.flat(Infinity);
  const renderChildren = flatChildren.filter(
    (item) => item !== null && item !== undefined && item !== false,
  );

  const propType = !props ? null : props;
  return {
    type,
    props: propType,
    children: renderChildren,
  };
}
