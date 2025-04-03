import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

// 1. 노드 제거 (newNode가 없고 oldNode가 있는 경우)
// 2. 새 노드 추가 (newNode가 있고 oldNode가 없는 경우)
// 3. 텍스트 노드 업데이트
// 4. 노드 교체 (newNode와 oldNode의 타입이 다른 경우)
// 5. 같은 타입의 노드 업데이트
//     - 속성 업데이트
//     - 자식 노드 재귀적 업데이트
//     - 불필요한 자식 노드 제거

function updateAttributes(target, originNewProps, originOldProps) {
  const newProps = { ...originNewProps };
  const oldProps = { ...originOldProps };

  // 이전 이벤트 핸들러 제거
  Object.keys(oldProps).forEach((propName) => {
    if (
      propName.startsWith("on") &&
      (!newProps[propName] || newProps[propName] !== oldProps[propName])
    ) {
      removeEvent(target, propName); // 전체 이벤트 이름을 전달 (예: "onClick")
    }
  });

  // 새로운 속성 추가 및 변경
  Object.keys(newProps).forEach((propName) => {
    if (propName.startsWith("on")) {
      addEvent(target, propName, newProps[propName]); // 전체 이벤트 이름을 전달
    } else if (propName === "className") {
      target.setAttribute("class", newProps[propName]);
    } else {
      target.setAttribute(propName, newProps[propName]);
    }
  });

  // 삭제된 속성 제거
  Object.keys(oldProps).forEach((propName) => {
    if (!(propName in newProps) && !propName.startsWith("on")) {
      // 이벤트는 위에서 처리했으므로 제외
      target.removeAttribute(propName);
    }
  });
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!parentElement) return;

  const existingNode = parentElement.childNodes[index];

  // newNode가 있고 oldNode가 없는 경우
  if (!oldNode) {
    if (existingNode && newNode === oldNode) return;
    parentElement.appendChild(createElement(newNode));
    return;
  }

  // newNode가 없고 oldNode가 있는 경우 노드 제거
  if (!newNode) {
    parentElement.removeChild(existingNode);
    return;
  }

  // 타입이 다른 경우 노드 교체
  if (newNode.type !== oldNode.type) {
    parentElement.replaceChild(createElement(newNode), existingNode);
    return;
  }

  // 텍스트 노드 업데이트
  if (typeof newNode === "string" || typeof newNode === "number") {
    if (newNode !== oldNode) {
      existingNode.textContent = newNode;
    }
    return;
  }

  // 속성 업데이트
  if (existingNode instanceof HTMLElement) {
    updateAttributes(existingNode, newNode.props, oldNode.props);
  }

  // 재귀 비교
  for (let i = 0; i < newNode.children.length; i++) {
    if (existingNode instanceof HTMLElement) {
      updateElement(existingNode, newNode.children[i], oldNode.children[i], i);
    }
  }
}
