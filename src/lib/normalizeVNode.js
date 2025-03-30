export function normalizeVNode(vNode) {
  if (
    typeof vNode === "undefined" ||
    typeof vNode === "boolean" ||
    vNode === null
  ) {
    return "";
  }

  if (typeof vNode === "object") {
    const { type, props, children } = vNode;

    if (typeof type === "function") {
      return normalizeVNode(type({ ...props, children }));
    }
    return {
      type,
      props,
      children: children
        .map((child) => normalizeVNode(child))
        .filter((normalizeChild) => normalizeChild !== ""),
    };
  }

  return String(vNode);
}
