import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

// newProps와 oldProps의 속성을 비교하여 변경된 부분만 반영
function updateAttributes(target, newProps = {}, oldProps = {}) {
  // 새로운 돔 트리를 순회
  Object.entries(newProps).map(([key, value]) => {
    // 이미 있는 속성이면 넘어가기
    if (oldProps[key] === value) return;

    // className은 class로 변경
    if (key === "className") key = "class";

    // onClick -> click 이름 바꿔 이벤트 추가
    if (key.startsWith("on")) {
      return addEvent(target, key.replace("on", "").toLowerCase(), value);
    }

    target.setAttribute(key, value);
  });

  // old 돔 트리를 순회
  Object.keys(oldProps).map((key) => {
    // 새로운 돔트리에 없는 값이라면 넘어감
    if (newProps[key] !== undefined) return;

    // 이벤트 제거
    if (key.startsWith("on")) {
      removeEvent(target, key.replace("on", "").toLowerCase(), oldProps[key]);
    }

    // 속성제거
    target.removeAttribute(key);
  });
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!parentElement) return;

  // old 노드만 있는 경우
  if (!newNode && oldNode) {
    return parentElement.removeChild(parentElement.childNodes[index]);
  }

  // new 노드만 있는 경우
  if (newNode && !oldNode) {
    return parentElement.appendChild(createElement(newNode));
  }

  // old 노드와 new 노드 모두 text 타입일 경우
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode === oldNode) return;
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  // old 노드와 new 노드의 태그이름이 다를경우
  if (oldNode.type !== newNode.type) {
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  // old 노드와 new 노드의 태그이름이 같을 경우
  updateAttributes(
    parentElement.childNodes[index],
    newNode.props ?? {},
    oldNode.props ?? {},
  );

  // new노드와 old노드의 모든 자식 태그를 순회하며 1~5 내용반복
  const maxLength = Math.max(
    newNode.children?.length || 0,
    oldNode.children?.length || 0,
  );

  for (let i = 0; i < maxLength; i++) {
    updateElement(
      parentElement.childNodes[index],
      newNode.children?.[i],
      oldNode.children?.[i],
      i,
    );
  }
}
