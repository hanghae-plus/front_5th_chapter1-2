export function normalizeVNode(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean")
    return "";
  if (typeof vNode !== "object") return String(vNode);
  if (typeof vNode?.type === "function") {
    return normalizeVNode(
      vNode.type({
        ...vNode?.props,
        children: vNode?.children,
      }),
    );
  }
  return {
    type: vNode?.type ?? "",
    props: vNode?.props ?? null,
    children: vNode?.children?.map(normalizeVNode).filter(Boolean) ?? [],
  };
}
