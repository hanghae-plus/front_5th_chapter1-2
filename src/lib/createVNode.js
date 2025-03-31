export function createVNode(type, props, ...children) {
  console.log(children);
  return {
    type,
    props,
    children: children
      .flat(Infinity)
      .filter((v) => typeof v === "number" || Boolean(v)),
  };
}
