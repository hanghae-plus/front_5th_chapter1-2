import { VNode } from "../types";

export function normalizeVNode(
  vNode: VNode | boolean | number | string,
): VNode | string {
  if (
    vNode === null ||
    vNode === undefined ||
    vNode === true ||
    vNode === false
  ) {
    return "";
  }
  if (typeof vNode === "string" || typeof vNode === "number") {
    return vNode.toString();
  }

  if (typeof vNode.type === "function") {
    const result = vNode.type({
      ...vNode.props,
      children: vNode.children,
    });

    return normalizeVNode(result);
  }

  if (vNode.type) {
    return {
      type: vNode.type,
      props: vNode.props,
      children: Array.isArray(vNode.children)
        ? vNode.children.map(normalizeVNode).filter((child) => child !== "")
        : [],
    };
  }

  return vNode;
}
