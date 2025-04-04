/**
  1. "div", { id: "test" }, "Hello"
  -> VNode: { 
    type: "div", 
    props: { id: "test" }, 
    children: ["Hello"] 
  }
 */
export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: children
      .flat(Infinity)
      .filter((child) => child !== false && child != null),
  };
}
