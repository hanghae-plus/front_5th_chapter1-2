import { createElement } from "./createElement.js";
import { updateAttributes } from "./updateAttributes.js";

// 텍스트 노드 업데이트
function updateTextNode(parentElement, newNode, oldNode, index) {
  const existingElement = parentElement.childNodes[index];
  const newValue = String(newNode);

  if (typeof oldNode === "string") {
    if (newValue !== String(oldNode)) existingElement.nodeValue = newValue;
    return;
  }

  parentElement.replaceChild(
    document.createTextNode(newValue),
    existingElement,
  );
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!parentElement) return;
  const existingElement = parentElement.childNodes[index];

  // 노드 추가/제거
  if (newNode && !oldNode)
    return parentElement.appendChild(createElement(newNode));
  if (!newNode && oldNode) return parentElement.removeChild(existingElement);
  if (typeof newNode === "string")
    return updateTextNode(parentElement, newNode, oldNode, index);

  // 타입이 다르면 교체
  if (newNode.type !== oldNode.type) {
    return parentElement.replaceChild(createElement(newNode), existingElement);
  }

  // props & children 업데이트
  updateAttributes(existingElement, newNode.props, oldNode.props);

  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];
  const maxLength = Math.max(newChildren.length, oldChildren.length);

  for (let i = 0; i < maxLength; i += 1) {
    updateElement(existingElement, newChildren[i], oldChildren[i], i);
  }
}
