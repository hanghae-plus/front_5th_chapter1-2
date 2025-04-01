import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

// 5 - 1 속성 업데이트
function updateAttributes(target, originNewProps, originOldProps) {
  // 이벤트 핸들러 처리
  for (const [attr, value] of Object.entries(originNewProps)) {
    if (attr.startsWith("on")) {
      const eventType = attr.slice(2).toLowerCase();
      if (originOldProps[attr]) {
        removeEvent(target, eventType, originOldProps[attr]);
      }
      addEvent(target, eventType, value);
      continue;
    }

    const domAttr = attr === "className" ? "class" : attr;
    if (originOldProps[attr] === originNewProps[attr]) continue;
    target.setAttribute(domAttr, value);
  }

  // 제거된 이벤트 핸들러 정리
  for (const attr of Object.keys(originOldProps)) {
    if (attr.startsWith("on")) {
      const eventType = attr.slice(2).toLowerCase();
      if (originNewProps[attr] === undefined) {
        removeEvent(target, eventType, originOldProps[attr]);
      }
    }
    if (originNewProps[attr] !== undefined) continue;
    target.removeAttribute(attr);
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // 1. 노드 제거 (newNode가 없고 oldNode가 있는 경우)
  // 5 - 3 불필요한 자식 노드 제거
  if (!newNode && oldNode) {
    return parentElement.removeChild(parentElement.childNodes[index]);
  }

  // 2. 새 노드 추가 (newNode가 있고 oldNode가 없는 경우)
  if (newNode && !oldNode) {
    return parentElement.appendChild(createElement(newNode));
  }

  // 3. 텍스트 노드 업데이트
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode === oldNode) return;
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  // + 함수형 컴포넌트인 경우 비교 후 재사용
  if (typeof newNode.type === "function") {
    const oldComponent = oldNode.type === newNode.type ? oldNode : null;
    const nextVNode = newNode.type({
      ...newNode.props,
      children: newNode.children,
    });
    return updateElement(parentElement, nextVNode, oldComponent, index);
  }

  // 4. 노드 교체 (newNode와 oldNode의 타입이 다른 경우 전체 교체)
  if (newNode.type !== oldNode.type) {
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  // 5. 같은 타입의 노드 업데이트
  updateAttributes(
    parentElement.childNodes[index],
    newNode.props || {},
    oldNode.props || {},
  );
  const maxLength = Math.max(newNode.children.length, oldNode.children.length);
  for (let i = 0; i < maxLength; i++) {
    // 5 - 2 자식 노드 재귀적 업데이트
    updateElement(
      parentElement.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}
