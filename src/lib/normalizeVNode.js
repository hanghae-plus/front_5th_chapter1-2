export function normalizeVNode(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return `${vNode}`;
  }

  if (typeof vNode === "object") {
    if (typeof vNode.type === "function") {
      const Component = vNode.type;
      const props = { ...vNode.props };

      if (vNode.children && Array.isArray(vNode.children)) {
        props.children = vNode.children;
      }

      const result = Component(props);

      return normalizeVNode(result);
    }

    return {
      type: vNode.type,
      props: vNode.props ?? null,
      children: Array.isArray(vNode.children)
        ? vNode.children
            .flat(Infinity)
            .filter(
              (child) =>
                child !== null &&
                child !== undefined &&
                typeof child !== "boolean",
            )
            .map((child) => normalizeVNode(child))
        : [],
    };
  }

  if (typeof vNode === "function") {
    const result = vNode();
    return normalizeVNode(result);
  }

  return vNode;
}
