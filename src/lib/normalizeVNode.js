import { isTextNodeValue, shouldSkipRendering } from "../utils/renderUtils";
import { isValidChild } from "../utils/vNodeUtils";

export function normalizeVNode(vNode) {
  if (shouldSkipRendering(vNode)) {
    return "";
  }

  if (isTextNodeValue(vNode)) {
    return String(vNode);
  }

  if (typeof vNode === "function") {
    const returnValue = vNode();
    return normalizeVNode(returnValue);
  }

  if (typeof vNode !== "object") {
    return vNode;
  }

  if (typeof vNode.type === "function") {
    const props = { ...(vNode.props ?? {}), children: vNode.children };

    return normalizeVNode(vNode.type(props));
  }

  if (Array.isArray(vNode.children)) {
    return {
      ...vNode,
      children: vNode.children.map(normalizeVNode).filter(isValidChild),
    };
  }

  return vNode;
}
