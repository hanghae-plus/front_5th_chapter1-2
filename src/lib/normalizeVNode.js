import { isRenderableElement } from "../utils/isRenderableElement";

export function normalizeVNode(vNode) {
  if (!isRenderableElement(vNode)) return "";

  if (typeof vNode === "string") return vNode;
  if (typeof vNode === "number") return vNode.toString();

  if (typeof vNode.type === "function") {
    return normalizeVNode(
      vNode.type({
        ...vNode.props,
        children: vNode.children,
      }),
    );
  }

  if (typeof vNode.type === "string") {
    return {
      type: vNode.type,
      props: vNode.props,
      children: vNode.children.map(normalizeVNode).filter(isRenderableElement),
    };
  }
}
