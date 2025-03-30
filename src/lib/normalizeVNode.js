export function normalizeVNode(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return `${vNode}`;
  }

  if (typeof vNode === "function") {
    return normalizeVNode(vNode());
  }

  return {
    type: vNode.type,
    props: vNode.props,
    children: vNode.children.map(normalizeVNode),
  };
}
