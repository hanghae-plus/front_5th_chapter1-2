import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";
import { normalizeVNode } from "./normalizeVNode.js";

function updateAttributes(target, originNewProps, originOldProps) {
  for (const key in originOldProps) {
    if (key.startsWith("on") && typeof originOldProps[key] === "function") {
      const eventType = key.toLowerCase().substring(2);
      if (
        !(key in originNewProps) ||
        originNewProps[key] !== originOldProps[key]
      ) {
        removeEvent(target, eventType, originOldProps[key]);
      }

      addEvent(target, eventType, ori);
    } else if ((!key) in originNewProps) {
      target.removeAttribute(key);
    }
  }

  for (const key in originNewProps) {
    if (originOldProps[key] !== originNewProps[key]) {
      target.setAttribute(key, originNewProps[key]);
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  const updatedNode = createElement(normalizeVNode(newNode));
  const existedNode = parentElement.childNodes[index];

  // 기존 노드가 없으면 추가
  if (!existedNode) {
    console.log("here!");
    parentElement.appendChild(updatedNode);
    return;
  }

  // 바뀔 노드가 없으면 삭제
  if (!updatedNode) {
    parentElement.removeChild(existedNode);
    return;
  }

  // 업데이트
  if (typeof oldNode !== typeof newNode || oldNode.type !== newNode.type) {
    parentElement.replaceChild(updatedNode, existedNode);
    return;
  }

  // props 업데이트
  if (newNode.type) {
    updateAttributes(
      parentElement.childNodes[index],
      newNode.props,
      oldNode.props,
    );

    // 자식 순회
    const max = Math.max(newNode.children.length, oldNode.children.length);
    for (let i = 0; i < max; i++) {
      console.log(`children here! ${i}`);
      updateElement(
        parentElement.childNodes[index],
        newNode.children[i],
        oldNode.children[i],
      );
    }
  }
}
