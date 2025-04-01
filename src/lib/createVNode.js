export function createVNode(type, props, ...children) {
  return {
    type: type,
    props: props,
    children: flattenChildren(children),
  };
}

function flattenChildren(children) {
  return children
    .flat(Infinity)
    .map((child) =>
      child === null || child === undefined || typeof child === "boolean"
        ? ""
        : child,
    )
    .filter((child) => child !== "");
}
