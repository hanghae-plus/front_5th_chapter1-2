import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

/*
 * DOM 요소의 속성을 업데이트 하는 함수
 * 업데이트할 DOM 요소와 새로 변경할 속성, 이전 속성을 인자로 받는다.
 * */
function updateAttributes(target, newProps = {}, oldProps = {}) {
  // 제거할 속성 처리
  Object.keys(oldProps).forEach((prop) => {
    // 새 속성이 없거나 null/undefined 인 경우 제거
    if (!(prop in newProps) || newProps[prop] == null) {
      // 이벤트 핸들러인 경우 이벤트 리스너 제거
      if (prop.startsWith("on") && typeof oldProps[prop] === "function") {
        const eventType = prop.toLowerCase().substring(2);
        removeEvent(target, eventType, oldProps[prop]);
      } else {
        // 일반 속성인 경우 속성 제거
        if (prop === "className") {
          target.removeAttribute("class");
        } else {
          target.removeAttribute(prop);
        }
      }
    }
  });

  // 추가/업데이트 할 속성 처리
  Object.keys(newProps).forEach((prop) => {
    // 값이 변경된 경우만 업데이트
    if (newProps[prop] !== oldProps[prop]) {
      // 이벤트 핸들러 처리
      if (prop.startsWith("on") && typeof newProps[prop] === "function") {
        const eventType = prop.toLowerCase().substring(2);

        // 이전 핸들러 제거
        if (typeof oldProps[prop] === "function") {
          removeEvent(target, eventType, oldProps[prop]);
        }

        // 새 핸들러 추가
        addEvent(target, eventType, newProps[prop]);
      } else if (prop === "style" && typeof newProps[prop] === "object") {
        // 스타일 처리
        const newStyle = newProps[prop];
        const oldStyle = oldProps[prop] || {};
        // 이전 스타일 제거
        Object.keys(oldStyle).forEach((key) => {
          if (!(key in newStyle)) {
            target.style[key] = "";
          }
        });

        // 새 스타일 적용
        Object.keys(newStyle).forEach((key) => {
          if (newStyle[key] !== oldStyle[key]) {
            target.style[key] = newStyle[key];
          }
        });
      } else if (prop === "className") {
        // 클래스 명 처리
        target.className = newProps[prop];
      } else if (typeof newProps[prop] === "boolean") {
        //불린 속성 처리
        if (newProps[prop]) {
          target.setAttribute(prop, "");
          // 특정 DOM 속성 직접 설정
          if (prop in target) {
            target[prop] = true;
          }
        } else {
          target.removeAttribute(prop);
          if (prop in target) {
            target[prop] = false;
          }
        }
      } else {
        // 일반 속성 처리
        target.setAttribute(prop, newProps[prop]);

        // 특정 DOM 속성 직접 설정 (value, checked ...)
        if (prop === "value" || prop === "checked" || prop === "selected") {
          target[prop] = newProps[prop];
        }
      }
    }
  });
}

/*
 * 가상 DOM의 변경사항을 실제 DOM에 적용하는 함수
 * 부모 DOM 요소, 새 가상 DOM 요소, 이전 가상 DOM 요소, 자식 노드의 인덱스 값 을 인자로 받는다.
 * */
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  // newNode = normalizeVNode(newNode);
  // oldNode = normalizeVNode(oldNode);

  // 1. 이전 노드가 없고 새 노드가 있는 경우 (추가)
  if (!oldNode && newNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  // 2. 이전 노드가 있고 새 노드가 없는 경우 (제거)
  if (oldNode && !newNode) {
    parentElement.removeChild(parentElement.childNodes[index]);
    return;
  }

  // 3. 두 노드가 모두 텍스트 노드인 경우
  if (typeof newNode !== "object" && typeof oldNode !== "object") {
    // 텍스트가 변경된 경우만 업데이트
    if (newNode !== oldNode) {
      parentElement.replaceChild(
        document.createTextNode(newNode),
        parentElement.childNodes[index],
      );
    }
    return;
  }

  // 4. 노드 타입이 다른 경우 (교체)
  if (oldNode.type !== newNode.type) {
    parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
    return;
  }

  // 5. 같은 타입의 요소인 경우 (속성만 변경)
  updateAttributes(
    parentElement.childNodes[index],
    newNode.props,
    oldNode.props,
  );

  // 6. 자식 노드 비교 및 업데이트
  const newLen = newNode.children ? newNode.children.length : 0;
  const oldLen = oldNode.children ? oldNode.children.length : 0;

  // 최대 자식 수만큼 반복
  for (let i = 0; Math.max(newLen, oldLen); i++) {
    updateElement(
      parentElement.childNodes[index],
      newNode.children ? newNode.children[i] : null,
      oldNode.children ? oldNode.children[i] : null,
      i,
    );
  }
}
