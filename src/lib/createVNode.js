const isNotFalsy = (el) => el !== false && el !== null && el !== undefined;

export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: children.flat(Infinity).filter(isNotFalsy),
  };
}
