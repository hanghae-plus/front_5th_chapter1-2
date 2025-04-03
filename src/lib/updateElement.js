import { addEvent, removeEvent } from "./eventManager";
// import { removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

/**
 * 실제 DOM 요소(`target`)의 속성(attribute)을 업데이트한다.
 *
 * 주어진 새로운 속성(`originNewProps`)과 이전 속성(`originOldProps`)을 비교하여,
 * 변경되었거나 새로 추가된 속성은 DOM에 반영하고,
 * 더 이상 존재하지 않는 속성은 DOM에서 제거한다.
 *
 * 또한 JSX 호환을 위해 `className` 속성은 `class`로 변환 처리한다.
 * @param {HTMLElement} target - 업데이트 대상이 되는 실제 DOM 요소
 * @param {*} originNewProps - 새롭게 반영할 속성(props) 객체
 * @param {*} originOldProps - 이전 렌더링 시점의 속성(props) 객체
 */
// function updateAttributes(target, originNewProps, originOldProps) {
//   if (!target || target.nodeType !== 1) return; // ✅ 방어 코드 추가! 요소 노드가 아닐 경우 바로 리턴
//   // 코드 내부에서 null, undefined로 처리 되지 않게 안전하게 처리
//   const newProps = originNewProps || {};
//   const oldProps = originOldProps || {};

//   // ✅ JSX 호환: className → class 변환
//   if ("className" in newProps) {
//     newProps.class = newProps.className;
//     delete newProps.className;
//   }

//   if (newProps.class !== oldProps.class) {
//     target.className = newProps.class; // className 갱신
//   }

//   // 1️⃣ 새로운 props 순회: 추가되었거나 변경된 것 반영
//   for (const [key, value] of Object.entries(newProps)) {
//     // console.log("key=>", key);
//     if (value !== oldProps[key]) {
//       if (key.startsWith("on")) {
//         const eventType = key.toLowerCase().slice(2);
//         addEvent(target, eventType, value); // 새로운 핸들러 등록
//       } else {
//         target.setAttribute(key, value); // setAttribute는 오직 노드 요소에만 적용 가능
//       }
//     }
//   }

//   // 2️⃣ 이전 props 순회: 삭제된 것 제거
//   for (const [key, value] of Object.entries(oldProps)) {
//     if (!(key in newProps)) {
//       console.log("key=>", key);
//       const eventType = key.toLowerCase().slice(2);
//       removeEvent(target, eventType, value); // 이전 핸들러 제거

//       // if (key.startsWith("on")) {
//       //   const eventType = key.toLowerCase().slice(2);
//       //   console.log("key=>", key);
//       //   removeEvent(target, eventType, value); // 이전 핸들러 제거
//       // } else {
//       //   target.removeAttribute(key); // setAttribute는 오직 노드 요소에만 적용 가능
//       // }
//     }
//   }
// }

function updateAttributes(target, originNewProps, originOldProps) {
  const newProps = { ...originNewProps };
  const oldProps = { ...originOldProps };

  // 이전 이벤트 핸들러 제거
  Object.keys(oldProps).forEach((propName) => {
    if (
      propName.startsWith("on") &&
      (!newProps[propName] || newProps[propName] !== oldProps[propName])
    ) {
      const eventType = propName.toLowerCase().substring(2);
      removeEvent(target, eventType, oldProps[propName]);
    }
  });

  // 새로운 속성 추가 및 변경
  Object.keys(newProps).forEach((propName) => {
    if (propName.startsWith("on")) {
      const eventType = propName.toLowerCase().substring(2);
      addEvent(target, eventType, newProps[propName]);
    } else if (propName === "className") {
      target.setAttribute("class", newProps[propName]);
    } else {
      target.setAttribute(propName, newProps[propName]);
    }
  });

  // 삭제된 속성 제거
  Object.keys(oldProps).forEach((propName) => {
    if (!(propName in newProps)) {
      target.removeAttribute(propName);
    }
  });
}

/**
 * Virtual DOM diff 알고리즘의 핵심
 *
 * 가상 DOM(VNode)의 변경 사항을 실제 DOM에 반영하는 함수.
 *
 * 새로운 VNode(`newNode`)와 이전 VNode(`oldNode`)를 비교해서,
 * 실제 DOM(`parentElement`)을 효율적으로 업데이트 한다.
 *
 * 변경된 부분만 업데이트하고, 기존 DOM 노드를 최대한 재사용 하여 성능을 최적화 한다.
 * @param {HTMLElement} parentElement - 업데이트 대상이 되는 부모 DOM 요소
 * @param {Object|string|number} newNode - 새롭게 렌더링할 VNode (또는 문자열/숫자)
 * @param {Object|string|number} oldNode - 이전에 렌더링된 VNode (또는 문자열/숫자)
 * @param {number} [index=0] - 부모의 자식 중 몇 번쨰 노드인지 나타내는 인덱스 (재귀에서 사용됨)
 * @returns {void}
 */
export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (!parentElement) return;

  const existingElement = parentElement.childNodes[index];

  // 1. oldNode가 없으면 새로 추가
  if (!oldNode) {
    if (existingElement && newNode === oldNode) return;
    parentElement.appendChild(createElement(newNode));
    return;
  }

  // 2. newNode가 없으면 제거
  if (!newNode) {
    parentElement.removeChild(existingElement);
    return;
  }

  // 3. 타입이 다르면 교체
  if (newNode.type !== oldNode.type) {
    parentElement.replaceChild(createElement(newNode), existingElement);
    return;
  }

  // 4. 텍스트 노드면 교체
  if (typeof newNode === "string" || typeof newNode === "number") {
    if (newNode !== oldNode) {
      existingElement.textContent = newNode;
    }
    return;
  }

  // 5. props 업데이트
  if (existingElement instanceof HTMLElement) {
    updateAttributes(existingElement, newNode.props, oldNode.props);
  }

  // 6. 자식 노드 처리
  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];
  const maxLength = Math.max(newChildren.length, oldChildren.length);

  // 🔥 텍스트 노드만 있는 경우 중첩 방지를 위해 textContent로 교체
  const isAllText =
    newChildren.every((c) => typeof c === "string" || typeof c === "number") &&
    oldChildren.every((c) => typeof c === "string" || typeof c === "number");

  if (isAllText && existingElement.textContent !== newChildren.join("")) {
    existingElement.textContent = newChildren.join("");
    return;
  }

  // 🔁 재귀 비교
  for (let i = 0; i < maxLength; i++) {
    if (existingElement instanceof HTMLElement) {
      updateElement(existingElement, newChildren[i], oldChildren[i], i);
    }
  }
}
