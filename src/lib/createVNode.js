function noBoolean(children) {
  return children
    .flat(Infinity)
    .filter((child) => child != null && typeof child !== "boolean");
}

export function createVNode(type, props, ...children) {
  const flatArray = noBoolean(children);
  return { type, props, children: flatArray };
}
