import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";
import { isEvent } from "../utils/eventUtils.js";

/**
 * updateAttributes
 * 실제 구현에서는 속성, 이벤트, 스타일 등 oldProps와 newProps를 비교하여
 * 변경된 부분만 업데이트할 수 있도록 작성합니다.
 * 여기서는 예시로 단순하게 작성합니다.
 */

/**
 * reconcile 함수는 parentElement의 index번째 자식 노드와
 * newNode(가상 노드) 및 oldNode(이전에 렌더링했던 가상 노드)를 비교하여
 * 변경된 부분만 실제 DOM에 반영
 *
 * Fiber 아키텍처에서 render phase와 commit phase를 단순화한 방식으로
 * diffing 후 효과(effect)를 결정하여 commit하는 개념을 도입.
 *
 * @param {HTMLElement} parentElement - 부모 DOM 요소
 * @param {Object} newNode - 새 가상 노드 (예: { type, props })
 * @param {Object} oldNode - 이전 가상 노드 (예: { type, props })
 * @param {number} index - parentElement의 자식 인덱스 (재귀용)
 */

export function reconcile(workInProgressRoot, newVNode, oldVNode, index = 0) {
  // parentElement의 실제 자식 DOM (oldNode와 매핑)
  const currentDom = workInProgressRoot.childNodes[index];

  console.log("currentDom", currentDom, newVNode, oldVNode);

  // --- Diffing Phase ---
  // 1. 새 노드가 존재하는데 이전 노드가 없으면 (PLACEMENT)
  if (!oldVNode && newVNode) {
    return workInProgressRoot.appendChild(createElement(newVNode));
  }

  // 2. 이전 노드는 있으나 새 노드가 없으면 (DELETION)
  if (oldVNode && !newVNode) {
    return currentDom.remove();
  }

  // 3. 노드가 둘다 string인 경우
  if (typeof newVNode === "string" && typeof oldVNode === "string") {
    console.log("newVNode.nodeValue", newVNode, oldVNode);
    if (newVNode !== oldVNode) {
      workInProgressRoot.replaceChild(createElement(newVNode), currentDom);
    }
    return;
  }

  // 4. 노드 타입이 다르면 (REPLACEMENT)
  if (newVNode.type !== oldVNode.type) {
    return replaceChildNode(workInProgressRoot, newVNode, currentDom);
  }

  //5. type은 같지만 key가 다른 경우, 이전 자식을 제거하고 새로운 자식을 추가
  if (
    newVNode.type === oldVNode.type &&
    newVNode?.props?.key !== undefined &&
    oldVNode?.props?.key !== undefined &&
    newVNode.props.key !== oldVNode.props.key
  ) {
    return replaceChildNode(workInProgressRoot, newVNode, currentDom);
  }

  // 5. 동일한 타입의 일반 DOM 요소의 경우
  //    - 먼저 속성(attributes, 이벤트 등)을 업데이트합니다.
  updateAttributes(currentDom, newVNode, oldVNode);

  // --- Commit Phase (재귀적으로 자식 노드에 대해 동일한 diffing 수행) ---
  const newChildren = newVNode.children || [];
  console.log("newChildren", newChildren[0]);
  const oldChildren = oldVNode.children || [];
  const max = Math.max(newChildren.length, oldChildren.length);
  for (let i = 0; i < max; i++) {
    // 자식 노드에 대해서도 같은 방식으로 diffing 및 업데이트
    reconcile(currentDom, newChildren[i], oldChildren[i], i);
  }
}

function updateAttributes(dom, newVNode, oldVNode) {
  const newNodeProps = { ...newVNode.props };
  const oldNodeProps = { ...oldVNode.props };
  for (const [attr, value] of Object.entries(newNodeProps)) {
    // console.log("updateAttributes", attr, value);

    if (oldNodeProps[attr] === newNodeProps[attr]) continue;
    if (attr === "className") {
      dom.setAttribute("class", value);
    } else if (isEvent(attr) && typeof value === "function") {
      addEvent(dom, attr.slice(2).toLowerCase(), newNodeProps[attr]);
    } else {
      dom.setAttribute(attr, value);
    }
  }

  for (const attr of Object.keys(oldNodeProps)) {
    if (newNodeProps[attr] !== undefined) continue;
    console.log("attrattr", attr);
    if (isEvent(attr)) {
      //   console.log("attrattr", attr, value);
      removeEvent(dom, attr.slice(2).toLowerCase(), oldNodeProps[attr]);
    }
    dom.removeAttribute(attr);
  }
}

function replaceChildNode(workInProgressRoot, newVNode, currentDom) {
  return workInProgressRoot.replaceChild(createElement(newVNode), currentDom);
}
