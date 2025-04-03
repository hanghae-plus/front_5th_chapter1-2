export function normalizeVNode(vNode) {
  if (
    vNode === null ||
    vNode === undefined ||
    vNode === false ||
    vNode === true
  ) {
    return "";
  }

  if (typeof vNode === "number" || typeof vNode === "string")
    return String(vNode);

  if (Array.isArray(vNode)) {
    return vNode.flat(Infinity).map(normalizeVNode);
  }

  if (typeof vNode.type === "function") {
    return normalizeVNode(
      vNode.type({
        ...vNode.props,
        children: vNode.children,
      }),
    );
  }

  return {
    type: vNode.type,
    props: vNode.props,
    children: normalizeVNode(vNode.children),
  };
}
