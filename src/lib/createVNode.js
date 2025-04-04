function isValidChild(child) {
  if (typeof child === "boolean" && child === false) return false;
  if (child === null || child === undefined) return false;
  return true;
}

export function createVNode(type, props, ...children) {
  return {
    type,
    props: props,
    children: children.flat(Infinity).filter(isValidChild),
  };
}
