function recursionNormalize(value) {
  return (Array.isArray(value) && value.flat(Infinity))
    .map(normalizeVNode)
    .filter((v) => v !== "");
}

function transformNormalize(vNode) {
  if (
    typeof vNode === "undefined" ||
    typeof vNode === "boolean" ||
    vNode === null
  ) {
    return "";
  }
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }
  if (typeof vNode === "object" && typeof vNode.type === "function") {
    return normalizeVNode(
      vNode.type({
        ...vNode.props,
        children: recursionNormalize(vNode.children),
      }),
    );
  }
  if (typeof vNode === "object" && typeof vNode.type === "string") {
    return {
      ...vNode,
      children: recursionNormalize(vNode.children),
    };
  }
  if (Array.isArray(vNode)) {
    return vNode
      .map(normalizeVNode)
      .flat(Infinity)
      .filter((v) => v !== null);
  }
  return vNode;
}

export function normalizeVNode(vNode) {
  return transformNormalize(vNode);
}