import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  for (const [attr, value] of Object.entries(originNewProps ?? {})) {
    if (originOldProps[attr] === originNewProps[attr]) continue;
    if (typeof originNewProps[attr] === "function") {
      addEvent(target, attr, originNewProps[attr]);
      continue;
    }

    if (attr === "className") {
      target.setAttribute("class", value);
      continue;
    }

    target.setAttribute(attr, value);
  }

  for (const attr of Object.keys(originOldProps ?? {})) {
    if (originNewProps[attr] !== undefined) continue;
    if (typeof originOldProps[attr] === "function") {
      const eventType = attr.replace(/^on/i, "").toLowerCase();
      removeEvent(target, eventType, originOldProps[attr]);
      continue;
    }

    if (attr === "className") {
      target.removeAttribute("class");
      continue;
    }

    target.removeAttribute(attr);
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // 1. 노드 제거 (newNode가 없고 oldNode가 있는 경우)
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

  // 4. 노드 교체 (newNode와 oldNode의 타입이 다른 경우)
  if (newNode.type !== oldNode.type) {
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  // 5. 같은 타입의 노드 업데이트

  // 속성 업데이트
  updateAttributes(
    parentElement?.childNodes?.[index],
    newNode.props ?? {},
    oldNode.props ?? {},
  );

  // 자식 노드 재귀적 업데이트
  const maxLength = Math.max(
    (newNode?.children ?? []).length,
    (oldNode?.children ?? []).length,
  );

  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parentElement?.childNodes?.[index],
      (newNode?.children ?? [])[i],
      (oldNode?.children ?? [])[i],
      i,
    );
  }
}
