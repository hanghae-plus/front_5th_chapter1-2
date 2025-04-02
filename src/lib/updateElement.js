import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";
import { getDomAttributeName, getPropNameFromAttr } from "../utils/domUtils.js";

function updateAttributes(target, originNewProps, originOldProps) {
  // originOldProps(NamedNodeMap)을 객체로 변환
  const oldProps = {};

  for (let i = 0; i < originOldProps.length; i++) {
    const oldAttribute = originOldProps[i];

    oldProps[getPropNameFromAttr(oldAttribute.name)] = oldAttribute.value;
  }

  if (!target.__eventHandlers) {
    target.__eventHandlers = {};
  }
  const currentEventHandlers = target.__eventHandlers;

  const currentEventHandlerKeys =
    Object.getOwnPropertyNames(currentEventHandlers);

  // 새 props에 없는 경우 제거
  for (const key of currentEventHandlerKeys) {
    if (key in originNewProps) continue;

    const eventType = key.slice(2).toLowerCase();

    removeEvent(target, eventType, currentEventHandlers[key]);
    delete currentEventHandlers[key];
  }

  // 새 props를 순회하며 속성 추가/업데이트
  for (const key in originNewProps) {
    const newValue = originNewProps[key];

    const isFalsyValue =
      newValue === null || newValue === undefined || newValue === false;
    const isEventKey = key.startsWith("on");
    const isFunctionValue = typeof newValue === "function";

    const eventType = key.slice(2).toLowerCase();

    if (isFalsyValue) {
      if (isEventKey) {
        if (currentEventHandlers[key]) {
          removeEvent(target, eventType, currentEventHandlers[key]);
          delete currentEventHandlers[key];
        }

        continue;
      }

      target.removeAttribute(getDomAttributeName(key));

      continue;
    }

    // 이벤트 핸들러인 경우
    if (isEventKey && isFunctionValue) {
      // 기존 핸들러와 다르면 추가
      if (currentEventHandlers[key] !== newValue) {
        if (currentEventHandlers[key]) {
          removeEvent(target, eventType, currentEventHandlers[key]);
        }

        addEvent(target, eventType, newValue);
        currentEventHandlers[key] = newValue;
      }

      continue;
    }

    // 일반 속성인 경우
    if (oldProps[key] === String(newValue)) continue;

    target.setAttribute(getDomAttributeName(key), newValue);
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!oldNode && newNode) {
    const newElement = createElement(newNode);

    if (index < parentElement.childNodes.length) {
      parentElement.insertBefore(newElement, parentElement.childNodes[index]);
    } else {
      parentElement.appendChild(newElement);
    }

    return;
  }

  if (!newNode && oldNode) {
    parentElement.removeChild(oldNode);

    return;
  }

  // 텍스트 노드일 경우
  if (typeof newNode === "string" || typeof newNode === "number") {
    if (oldNode.nodeType === Node.TEXT_NODE) {
      // 텍스트가 다른 경우에만 업데이트

      if (oldNode.nodeValue === newNode) return;

      oldNode.nodeValue = newNode;

      return;
    }

    // 이전 노드가 텍스트 노드가 아닌 경우, 텍스트 노드로 교체
    const newElement = document.createTextNode(newNode);

    parentElement.replaceChild(newElement, oldNode);

    return;
  }

  // type과 tagName이 다르면 교체
  if (newNode.type.toUpperCase() !== oldNode.tagName) {
    const newElement = createElement(newNode);

    parentElement.replaceChild(newElement, oldNode);

    return;
  }

  // type과 tagName이 같으면 속성 업데이트
  updateAttributes(oldNode, newNode.props || {}, oldNode.attributes || {});

  // 자식 노드들을 재귀적으로 업데이트
  const newNodeLength = newNode.children ? newNode.children.length : 0;
  const oldNodeLength = oldNode.childNodes.length;

  for (let i = 0; i < Math.max(newNodeLength, oldNodeLength); i++) {
    updateElement(
      oldNode,
      newNode.children ? newNode.children[i] : null,
      oldNode.childNodes[i],
      i,
    );
  }
}
