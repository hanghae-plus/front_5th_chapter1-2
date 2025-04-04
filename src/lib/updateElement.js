import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

//변경된 부분을 찾아서 바꿔주자
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  const element = parentElement.childNodes[index];

  //노드삭제
  if (!newNode && oldNode) {
    return parentElement.removeChild(element);
  }

  //새 노드 추가
  if (newNode && !oldNode) {
    const created = createElement(newNode);
    return parentElement.appendChild(created);
  }

  //텍스트 노드 처리
  if (newNode.type === "TEXT_ELEMENT" && oldNode.type === "TEXT_ELEMENT") {
    if (newNode.nodeValue === oldNode.nodeValue) return;
    console.log("텍스트 변경 감지:", oldNode.nodeValue, "→", newNode.nodeValue);
    return parentElement.replaceChild(createElement(newNode), element);
  }

  //타입이 다른 경우 교체
  if (newNode.type !== oldNode.type) {
    const created = createElement(newNode);
    return parentElement.replaceChild(created, element);
  }
  //속성 업데이트
  updateAttributes(element, newNode.props || {}, oldNode.props || {});

  //자식 노드 재귀적 업데이트
  const maxLength = Math.max(newNode.children.length, oldNode.children.length);
  for (let i = 0; i < maxLength; i++) {
    updateElement(element, newNode.children[i], oldNode.children[i], i);
  }
}

function updateAttributes(target, newProps, oldProps = {}) {
  if (!newProps || typeof newProps !== "object") return;

  for (const [key, value] of Object.entries(newProps)) {
    if (oldProps[key] === value) continue;

    if (key === "className") {
      target.setAttribute("class", value);
    } else if (key.startsWith("on") && typeof value === "function") {
      const eventName = key.slice(2).toLocaleLowerCase();
      if (oldProps[key]) removeEvent(target, eventName, oldProps[key]);
      addEvent(target, eventName, value);
    } else {
      target.setAttribute(key, value);
    }
  }

  for (const key of Object.keys(oldProps)) {
    if (!(key in newProps)) {
      if (key === "className") {
        target.removeAttribute("class");
      } else if (key.startsWith("on")) {
        removeEvent(target, key.slice(2).toLocaleLowerCase(), oldProps[key]);
      } else {
        target.removeAttribute(key);
      }
    }
  }
}
