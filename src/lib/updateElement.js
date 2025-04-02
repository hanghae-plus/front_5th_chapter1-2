import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  // 기존 프롭스와 신규 프롭스를 비교하여 변경된 프롭스로 업데이트해야함.
  // 신규를 기준으로 추가를 체크하고
  Object.entries(originNewProps).forEach(([key, value]) => {
    if (originNewProps[key] === originOldProps[key]) return;
    if (key === "className") {
      target.setAttribute("class", value);
      return;
    }
    if (key.startsWith("on")) {
      // event의 type 에 맞게 key 수정해줌.
      addEvent(target, key.slice(2).toLowerCase(), value);
      return;
    }
    return target.setAttribute(key, value);
  });
  // 기존을 기준으로 삭제를 체크한다.
  Object.entries(originOldProps).forEach(([key, value]) => {
    if (originNewProps[key] !== undefined || originNewProps[key] !== null)
      return;
    if (key === "className") {
      target.removeAttribute("class");
      return;
    }
    if (key.startsWith("on")) {
      // event의 type 에 맞게 key 수정해줌.
      removeEvent(target, key.slice(2).toLowerCase(), value);
      return;
    }
    target.removeAttribute(key);
  });
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (oldNode && !newNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
  }

  if (!oldNode && newNode) {
    parentElement.appendChild(createElement(newNode));
  }

  if (typeof oldNode === "string" && typeof newNode === "string") {
    if (oldNode === newNode) return;
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }
  console.log("oldNode", oldNode);
  console.log("newNode", newNode);
  if (oldNode.type !== newNode.type) {
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }
  // 위 경우에 해당하지않으면 속성을 비교하여 수정하고, 순회해야함. 즉 부모요소는 같은데 자식요소가 틀린경우.
  updateAttributes(
    parentElement.childNodes[index],
    newNode.props || {},
    oldNode.props || {},
  );
  // 무엇을 기준으로 순회해야할까... 노드의 깊이? => 더 긴놈으로 하면 일단 더 순회 많이하니까 그걸로 비교..?
  const maxLength = Math.max(oldNode.children.length, newNode.children.length);
  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parentElement.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}
