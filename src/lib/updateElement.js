import { createElement } from "./createElement.js";
import { isTextNodeValue, shouldSkipRendering } from "../utils/renderUtils.js";
import { updateAttributes } from "../utils/attributesUtils.js";
import { isDOMRenderable } from "../utils/vNodeUtils.js";

/**
 * 자식 노드들을 업데이트합니다.
 * @param {HTMLElement} $parent - 부모 DOM 요소
 * @param {Array} newChildren - 새 자식 노드 배열
 * @param {Array} oldChildren - 이전 자식 노드 배열
 * @param {number} startIndex - 시작 인덱스
 */
function updateChildren(
  $parent,
  newChildren = [],
  oldChildren = [],
  startIndex = 0,
) {
  const newLength = newChildren.length;
  const oldLength = oldChildren.length;
  const minLength = Math.min(newLength, oldLength);

  for (let i = 0; i < minLength; i += 1) {
    updateElement($parent, newChildren[i], oldChildren[i], startIndex + i);
  }

  if (newLength === oldLength) {
    return;
  }

  if (newLength > oldLength) {
    const fragment = document.createDocumentFragment();

    for (let i = oldLength; i < newLength; i += 1) {
      const newChild = newChildren[i];
      if (isDOMRenderable(newChild)) {
        fragment.appendChild(createElement(newChild));
      }
    }

    if (fragment.childNodes.length) {
      $parent.appendChild(fragment);
    }
    return;
  }

  for (let i = newLength; i < oldLength; i += 1) {
    $parent.removeChild($parent.childNodes[startIndex + newLength]);
  }
}

/**
 * 요소를 업데이트합니다.
 * @param {HTMLElement} parentElement - 업데이트할 DOM 요소의 부모
 * @param {Object} newNode - 새로운 가상 DOM 노드
 * @param {Object} oldNode - 이전 가상 DOM 노드
 * @param {number} index - 부모 요소 내에서의 자식 인덱스
 */
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!newNode && oldNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  if (newNode && !oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  if (isTextNodeValue(newNode) && isTextNodeValue(oldNode)) {
    const newText = String(newNode);
    const oldText = String(oldNode);

    if (newText !== oldText) {
      parentElement.childNodes[index].nodeValue = newText;
    }
    return;
  }

  if (shouldSkipRendering(newNode) && !shouldSkipRendering(oldNode)) {
    parentElement.childNodes[index].nodeValue = "";
    return;
  }

  if (
    typeof newNode !== typeof oldNode ||
    Array.isArray(newNode) !== Array.isArray(oldNode) ||
    (newNode && oldNode && newNode.type !== oldNode.type)
  ) {
    parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
    return;
  }

  if (Array.isArray(newNode) && Array.isArray(oldNode)) {
    updateChildren(parentElement, newNode, oldNode, index);
    return;
  }

  if (!parentElement || !parentElement.childNodes) {
    return;
  }

  if (
    newNode &&
    oldNode &&
    typeof newNode === "object" &&
    typeof oldNode === "object"
  ) {
    const $currentElement = parentElement.childNodes[index];

    updateAttributes($currentElement, newNode.props ?? {}, oldNode.props ?? {});
    updateChildren($currentElement, newNode.children, oldNode.children);
  }
}
