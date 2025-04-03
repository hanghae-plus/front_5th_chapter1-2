export const createVNode = (type, props, ...children) => ({
  type,
  props,
  children: children.flat(Infinity).filter((v) => v != null && v !== false),
});
