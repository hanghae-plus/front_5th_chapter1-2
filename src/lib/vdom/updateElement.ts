import { createElement } from "./createElement.js";
import { updateAttributes } from "./updateAttributes.js";
import { RawVNode, VNode } from "./types";

// 텍스트 노드 업데이트
function updateTextNode(
  parentElement: HTMLElement,
  newNode: string | number,
  oldNode: RawVNode,
  index: number,
) {
  const existingElement = parentElement.childNodes[index];
  const newValue = String(newNode);

  if (typeof oldNode === "string" || typeof oldNode === "number") {
    if (newValue !== String(oldNode)) existingElement.nodeValue = newValue;
    return;
  }

  parentElement.replaceChild(
    document.createTextNode(newValue),
    existingElement,
  );
}

export function updateElement(
  parentElement: HTMLElement,
  newNode: RawVNode,
  oldNode: RawVNode,
  index: number = 0,
) {
  if (!parentElement) return;
  const existingElement = parentElement.childNodes[index] as HTMLElement;

  // 둘 다 없는 경우
  if (!newNode && !oldNode) return;

  // 노드 추가/제거
  if (newNode && !oldNode)
    return parentElement.appendChild(createElement(newNode));
  if (!newNode && oldNode) return parentElement.removeChild(existingElement);

  // 텍스트 노드 처리
  if (typeof newNode === "string" || typeof newNode === "number")
    return updateTextNode(parentElement, newNode, oldNode, index);

  const node = newNode as VNode;

  // 타입이 다르면 교체
  if (node.type !== (oldNode as VNode).type) {
    return parentElement.replaceChild(createElement(node), existingElement);
  }

  // props & children 업데이트
  updateAttributes(existingElement, node.props, (oldNode as VNode).props);

  const newChildren = node.children || [];
  const oldChildren = (oldNode as VNode).children || [];
  const maxLength = Math.max(newChildren.length, oldChildren.length);

  for (let i = 0; i < maxLength; i += 1) {
    updateElement(existingElement, newChildren[i], oldChildren[i], i);
  }
}
