export function createVNode(type, props, ...children) {
  // console.log("createVNodeß");

  console.log(`createVNode > children: ${children}`);
  // console.log(children);
  return {
    type,
    props,
    children: children
      .flat(2)
      .filter((v) => v !== null && v !== undefined && v !== false),
  };
}
