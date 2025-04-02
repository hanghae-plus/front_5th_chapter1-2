export function normalizeVNode(vNode) {
  const regex = /^(true|false|undefined|null)$/g;
  if (String(vNode).match(regex)) {
    return String(vNode).replace(regex, "");
  }

  if (typeof vNode.type === "function") {
    return normalizeVNode(
      vNode.type({ ...vNode.props, children: vNode.children }),
    );
  }

  if (Array.isArray(vNode.children)) {
    return {
      ...vNode,
      children: vNode.children.map(normalizeVNode),
    };
  }

  return String(vNode);
}
