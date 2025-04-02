import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

// DOM 요소의 속성들을 업데이트하는 함수
function updateAttributes(target, newProps, oldProps) {
  // 1. 새로운 속성 추가 또는 업데이트
  for (const [key, value] of Object.entries(newProps || {})) {
    if (typeof value === "function") continue; // 이벤트 핸들러는 나중에 처리

    // className을 class로 변환
    const attrName = key === "className" ? "class" : key;
    target.setAttribute(attrName, value);
  }

  // 2. 제거된 속성 삭제
  for (const key of Object.keys(oldProps || {})) {
    if (key in (newProps || {})) continue;

    const attrName = key === "className" ? "class" : key;
    target.removeAttribute(attrName);
  }

  // 3. 이벤트 핸들러 업데이트
  // 이전 이벤트 핸들러 제거
  for (const [key, value] of Object.entries(oldProps || {})) {
    if (typeof value !== "function") continue;
    const eventType = key.replace("on", "").toLowerCase();
    removeEvent(target, eventType, value);
  }

  // 새로운 이벤트 핸들러 추가
  for (const [key, value] of Object.entries(newProps || {})) {
    if (typeof value !== "function") continue;
    const eventType = key.replace("on", "").toLowerCase();
    addEvent(target, eventType, value);
  }
}

// DOM 요소를 업데이트하는 메인 함수
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // 1. 노드가 없는 경우 처리
  if (!newNode && !oldNode) return;
  if (!newNode) {
    parentElement.childNodes[index]?.remove();
    return;
  }
  if (!oldNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  // 2. 텍스트 노드 처리
  if (typeof newNode === "string" || typeof newNode === "number") {
    if (newNode !== oldNode) {
      const textNode = document.createTextNode(String(newNode));
      const currentElement = parentElement.childNodes[index];
      if (currentElement) {
        parentElement.replaceChild(textNode, currentElement);
      } else {
        parentElement.appendChild(textNode);
      }
    }
    return;
  }

  // 3. 컴포넌트 처리
  if (typeof newNode.type === "function") {
    const newComponent = newNode.type({
      ...newNode.props,
      children: newNode.children,
    });
    updateElement(parentElement, newComponent, oldNode, index);
    return;
  }

  // 4. DOM 요소 처리
  let currentElement = parentElement.childNodes[index];

  // 타입이 다른 경우 새로운 요소로 교체
  if (newNode.type !== oldNode.type) {
    const newElement = createElement(newNode);
    if (currentElement) {
      parentElement.replaceChild(newElement, currentElement);
    } else {
      parentElement.appendChild(newElement);
    }
    return;
  }

  // 5. 속성 업데이트
  updateAttributes(currentElement, newNode.props, oldNode.props);

  // 6. 자식 노드 처리
  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];

  // 불필요한 자식 노드 제거
  while (currentElement.childNodes.length > newChildren.length) {
    currentElement.removeChild(currentElement.lastChild);
  }

  // 자식 노드 업데이트
  for (let i = 0; i < newChildren.length; i++) {
    updateElement(currentElement, newChildren[i], oldChildren[i], i);
  }
}
