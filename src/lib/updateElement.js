import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes($target, originNewProps, originOldProps) {
  if (originOldProps !== null && typeof originOldProps !== "undefined") {
    Object.entries(originOldProps).forEach(([key, value]) => {
      if (key.startsWith("on") && typeof value === "function") {
        removeEvent($target, key.replace("on", "").toLowerCase(), value);
      }
      $target.removeAttribute(key);
    });
  }
  if (originNewProps !== null && typeof originNewProps !== "undefined") {
    Object.entries(originNewProps).forEach(([key, value]) => {
      if (key === "className") key = "class";
      if (key.startsWith("on") && typeof value === "function") {
        const eventType = key.replace("on", "").toLowerCase();
        if (typeof originOldProps[key] === "function") {
          removeEvent($target, eventType, originOldProps[key]);
        }
        addEvent($target, eventType, value);
      } else {
        $target.setAttribute(key, value);
      }
    });
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!parentElement) return;
  const $oldEl = parentElement.childNodes[index];
  // newNode vs oldNode
  if (newNode && !oldNode) {
    parentElement.append(createElement(newNode));
    return;
  }
  if (!newNode && oldNode) {
    parentElement.removeChild($oldEl);
    return;
  }
  // node가 string일 경우
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode !== oldNode) {
      parentElement.textContent = newNode;
      return;
    }
  }

  // 같은 타입이면 props 업데이트
  updateAttributes($oldEl, newNode?.props || {}, oldNode?.props || {});

  // node가 다른 타입으로 교체된 경우
  if (newNode.type !== oldNode.type) {
    parentElement.replaceChild(createElement(newNode), $oldEl);
    return;
  }

  // node가 children을 가진 경우
  const longerOne = Math.max(
    newNode?.children?.length || 0,
    oldNode?.children?.length || 0,
  );
  if (longerOne > 0) {
    for (let i = 0; i < longerOne; i++) {
      updateElement($oldEl, newNode?.children[i], oldNode?.children[i], i);
    }
  }
}
