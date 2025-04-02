import { isEmptyNodeValue, isValidVNode } from "@/utils/validator";
import { VNode } from "../types";

export function normalizeVNode(vNode: VNode | number | string): VNode | string {
  if (isEmptyNodeValue(vNode)) {
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

  if (isValidVNode(vNode)) {
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
