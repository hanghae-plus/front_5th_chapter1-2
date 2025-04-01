export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: children.flat(Infinity).filter((el) => {
      return el !== null && el !== undefined && el !== false && el !== true;
    }),
  };
}
