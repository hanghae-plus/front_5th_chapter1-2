import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  // 새 속성 추가 변경

  if (!target) {
    return;
  }

  for (const key in originNewProps) {
    const newValue = originNewProps[key];
    const oldValue = originOldProps[key];

    if (newValue !== oldValue) {
      if (key.startsWith("on")) {
        // 이벤트 리스너 업데이트
        const eventType = key.slice(2).toLowerCase();
        addEvent(target, eventType, newValue);
      } else if (key === "className") {
        target.className = newValue;
      } else {
        target.setAttribute(key, newValue);
      }
    }
  }
  // 삭제된 속성 변경
  for (const key in originOldProps) {
    if (!(key in originNewProps)) {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();
        removeEvent(target, eventType);
      } else {
        target.removeAttribute(key);
      }
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!parentElement) return;
  if (!newNode && !oldNode) return;

  // 1. 노드 제거 (newNode가 없고 oldNode가 있는 경우)
  if (!newNode && oldNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  // 2. 새 노드 추가 (newNode가 있고 oldNode가 없는 경우)
  if (newNode && !oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  // 3. 텍스트 노드 업데이트
  if (typeof newNode === "string" && typeof oldNode === "string") {
    parentElement.childNodes[index].textContent = newNode;
  }

  // 4. 노드 교체 (newNode와 oldNode의 타입이 다른 경우)
  if (newNode.type !== oldNode.type) {
    const oldDOMNode = parentElement.childNodes[index]; // 실제 DOM 노드 가져오기
    parentElement.replaceChild(createElement(newNode), oldDOMNode);

    // const el = createElement(newNode);
    // parentElement.childNodes[index].replaceWith(el);

    return;
  }
  // 5. 같은 타입의 노드 업데이트
  //     - 속성 업데이트
  updateAttributes(
    parentElement.childNodes[index],
    newNode.props,
    oldNode.props,
  );
  //     - 자식 노드 재귀적 업데이트
  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];

  const max = Math.max(newChildren.length, oldChildren.length);
  for (let i = 0; i < max; i++) {
    updateElement(
      parentElement.childNodes[index],
      newChildren[i],
      oldChildren[i],
      i,
    );
  }

  //     - 불필요한 자식 노드 제거
  while (parentElement.childNodes.length > newChildren.length) {
    parentElement.removeChild(parentElement.lastChild);
  }
}
