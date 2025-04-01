export function normalizeVNode(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return `${vNode}`;
  }

  if (typeof vNode.type === "function") {
    const Component = vNode.type;
    return normalizeVNode(
      Component({
        ...vNode.props,
        children: vNode.children,
      }),
    );
  }

  return {
    type: vNode.type,
    props: vNode.props,
    children: vNode.children
      .map(normalizeVNode)
      .filter((child) => child !== ""),
  };
}
