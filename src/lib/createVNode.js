export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: children
      ? children
          .flat(Infinity)
          .filter((v) => typeof v === "number" || Boolean(v))
      : [],
  };
}
