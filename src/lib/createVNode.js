export function createVNode(type, props, ...children) {
  if (isVNode(type)) return type;
  else {
    const flattenChildren = getFlattenChildren(children);
    return { type, props, children: flattenChildren };
  }
}

function isVNode(node) {
  return typeof node === "object" && node !== null && "type" in node;
}

function getFlattenChildren(children) {
  if (Array.isArray(children)) {
    return children.flat(Infinity).filter((child) => !isEmpty(child));
  } else {
    return children;
  }
}

function isEmpty(value) {
  return value === false || value === null || value === undefined;
}
