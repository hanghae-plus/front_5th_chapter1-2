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
  //element의 이전 props, 새 props를 받아서
  //이전 props에만 있던 attribute는 삭제, 새 props에 있는 attribute는 추가
  //둘 다 같은 attribute가 있으면 새 props에 있는 attribute 값으로 업데이트

  //createElement의 updateAttributes() : element 새로 생성
  //updateElement의 updateAttributes() : 원래 있던 element의 props와 비교

  Object.entries(originNewProps).forEach(([key, value]) => {
    if (originOldProps[key] !== value) {
      if (key.indexOf("on") === 0) {
        const eventType = key.slice(2).toLowerCase();
        addEvent(target, eventType, value);
      } else if (key === "className") {
        target.setAttribute("class", value);
      } else {
        target.setAttribute(key, value);
      }
    }
  });

  Object.entries(originOldProps).forEach(([key, value]) => {
    if (!originNewProps[key]) {
      if (key.indexOf("on") === 0) {
        const eventType = key.slice(2).toLowerCase();
        removeEvent(target, eventType, value);
      } else if (key === "className") {
        target.removeAttribute("class");
      } else {
        target.removeAttribute(key);
      }
    }
  });
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  const currentElement = parentElement.childNodes[index]; //현재 노드

  if (!newNode && oldNode) {
    //1. 노드 제거
    return parentElement.removeChild(currentElement); //parentNode.removeChild(childNode) 자식 노드 제거
  }

  if (newNode && !oldNode) {
    //2. 새 노드 추가
    return parentElement.appendChild(createElement(newNode)); //parentNode.appendChild(newNode) 자식 노드 추가
  }

  if (typeof newNode === "string" && typeof oldNode === "string") {
    //3. 텍스트 노드 업데이트
    if (newNode !== oldNode) {
      currentElement.textContent = newNode;
    }
    return;
  }

  if (newNode.type !== oldNode.type) {
    //4. 노드 교체
    return parentElement.replaceChild(createElement(newNode), currentElement); //parentNode.replacChild(newChild, oldChild) 자식 노드 교체
  }

  updateAttributes(currentElement, newNode.props || {}, oldNode.props || {});

  //자식 노드 비교
  const maxLength = Math.max(
    newNode.children?.length || 0,
    oldNode.children?.length || 0,
  );

  for (let i = 0; i < maxLength; i++) {
    updateElement(currentElement, newNode.children[i], oldNode.children[i], i);
  }
}
