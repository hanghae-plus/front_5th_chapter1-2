import { flatDeep, treatAsBlank } from "../utils";

export function normalizeVNode(vNode) {
  if (treatAsBlank(vNode)) {
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
