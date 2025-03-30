export function createVNode(type, props, ...children) {
  if (isVNode(type)) return type;
  else {
    const flattenChildren = Array.isArray(children)
      ? getFlattenChildren(children)
      : children;
    return { type, props, children: flattenChildren };
  }
}

function isVNode(node) {
  return typeof node === "object" && node !== null && "type" in node;
}

export function getFlattenChildren(children) {
  return children.flat(Infinity).filter((child) => !isEmpty(child));
}

export function isEmpty(value) {
  return typeof value === "boolean" || value === null || value === undefined;
}
