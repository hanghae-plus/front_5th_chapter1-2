import { isEmptyStrType, isNumericOrStr } from "../utils/typeUtils";

export function createElement(vNode) {
  if (isEmptyStrType(vNode))
    return { nodeType: Node.TEXT_NODE, textContent: "" };
  if (isNumericOrStr(vNode))
    return { nodeType: Node.TEXT_NODE, textContent: String(vNode) };

  if (Array.isArray(vNode)) {
    const childNodes = vNode.map((item) => ({
      tagName: item.type.toUpperCase(),
    }));

    return {
      nodeType: Node.DOCUMENT_FRAGMENT_NODE,
      childNodes: childNodes,
    };
  }
}
