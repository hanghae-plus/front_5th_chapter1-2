import { isEmpty } from "../utils";

export function normalizeVNode(vNode) {
  if (isEmpty(vNode)) {
    return "";
  }
  if (typeof vNode === "string" || typeof vNode === "number") {
    return vNode.toString();
  }
  if (Array.isArray(vNode) && vNode.length === 1) {
    return vNode[0].toString();
  }
  if (typeof vNode.type === "function") {
    return normalizeVNode(
      vNode.type({ ...vNode.props, children: vNode.children }),
    );
  }
  return {
    type: vNode.type,
    props: vNode.props,
    children: Array.isArray(vNode.children)
      ? vNode.children.filter((child) => !isEmpty(child)).map(normalizeVNode)
      : normalizeVNode(vNode.children),
  };
}
