export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: children.flat(Infinity).filter(isValidChild),
  };
}

const isNullishOrBoolean = (value) =>
  [false, null, undefined, true].includes(value);
const isValidChild = (child) => !isNullishOrBoolean(child);
