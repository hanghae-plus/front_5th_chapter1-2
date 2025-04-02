export function createVNode(type, props, ...children) {
  const normalizedChildren = children
    .flat(Infinity)
    .filter(
      (child) =>
        !(child === null || child === undefined || typeof child === "boolean"),
    );

  return { type, props, children: normalizedChildren };
}
