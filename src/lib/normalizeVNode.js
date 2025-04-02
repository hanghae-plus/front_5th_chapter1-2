import { flatDeep } from "../utils";

export function normalizeVNode(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  if (Array.isArray(vNode)) {
    return vNode.map(normalizeVNode);
  }

  if (typeof vNode === "object") {
    const { type, props, children } = vNode;

    if (typeof type === "function") {
      vNode = normalizeVNode(type({ ...props, children }));
    }

    vNode.children = flatDeep(vNode.children)
      .map(normalizeVNode)
      .filter((v) => v !== "");
  }

  return vNode;
}
