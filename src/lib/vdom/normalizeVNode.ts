import { RawVNode, VNode } from "./types";

export function normalizeVNode(vNode: RawVNode): string | VNode {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  if (typeof vNode.type === "function") {
    const component = vNode.type;
    return normalizeVNode(
      component({
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
