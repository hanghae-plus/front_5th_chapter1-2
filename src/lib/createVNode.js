export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: children.flat(Infinity).filter(isTruthy),
  };
}

const isFalsy = (value) => [false, null, undefined, ""].includes(value);
const isTruthy = (value) => !isFalsy(value);
