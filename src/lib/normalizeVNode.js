export function normalizeVNode(vNode) {
  if (typeof vNode === "boolean" || vNode === undefined || vNode === null) {
    return "";
  } else if (typeof vNode === "string") {
    return vNode;
  } else if (typeof vNode === "number") {
    return vNode.toString();
  } else if (typeof vNode.type === "function") {
    const node = vNode.type({ ...vNode.props, children: vNode.children });
    return normalizeVNode(node);
  } else {
    return {
      ...vNode,
      children: vNode.children
        .flatMap(normalizeVNode)
        .filter((item) => Boolean(item)),
    };
  }
}
