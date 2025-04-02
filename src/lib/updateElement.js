import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  console.log("start updateAttributes");
  console.log("originNewProps: ", originNewProps);
  console.log("originOldProps: ", originOldProps);

  // // 달라지거나 추가된 Props를 반영
  // for (const [attr, value] of Object.entries(originNewProps)) {
  //   if (originOldProps[attr] === originNewProps[attr]) continue;
  //   target.setAttribute(attr, value);
  // }

  // // 없어진 props를 attribute에서 제거
  // for (const attr of Object.keys(originOldProps)) {
  //   if (originNewProps[attr] !== undefined) continue;
  //   target.removeAttribute(attr);
  // }

  // for (const [attr, value] of Object.entries(newProps)) {
  //   if (oldProps[attr] === newProps[attr]) continue;
  //   target.setAttribute(attr, value);
  // }

  // for (const attr of Object.keys(oldProps)) {
  //   if (newProps[attr] !== undefined) continue;
  //   target.removeAttribute(attr);
  // }

  // 이벤트 핸들러 제거 (이전에 있었지만 이제 없거나 변경된 경우)
  for (const [attr, value] of Object.entries(originOldProps)) {
    // 이벤트 속성(on으로 시작)이고 새 props에 없거나 값이 변경된 경우
    console.log("이벤트 속성000:", attr);
    if (
      attr.startsWith("on") &&
      (originNewProps[attr] === undefined || originNewProps[attr] !== value)
    ) {
      console.log("updateElement - removeEvent start");

      const eventType = attr.substring(2).toLowerCase();
      removeEvent(target, eventType, value);
    }
  }

  // 일반 속성 및 새 이벤트 핸들러 추가
  for (const [attr, value] of Object.entries(originNewProps)) {
    console.log("이벤트 속성111:", attr);
    console.log("value: ", value);
    console.log(originOldProps[attr]);
    console.log(originNewProps[attr]);
    console.log(originOldProps[attr] === originNewProps[attr]);

    if (originOldProps[attr] === originNewProps[attr]) continue;
    console.log("aaaaa");
    // 이벤트 속성인 경우
    if (attr.startsWith("on") && typeof value === "function") {
      console.log("들어오니?00");

      const eventType = attr.substring(2).toLowerCase();
      // 똑같은게 있는데 조건을 안걸어줘서 똑같은걸 add한다.
      if (typeof originOldProps[attr] === "function") {
        console.log("들어오니?11");

        removeEvent(target, eventType, originOldProps[attr]);
      }

      addEvent(target, eventType, value);
    }
    // 일반 속성인 경우
    else {
      target.setAttribute(attr, value);
    }
  }

  // 없어진 일반 속성 제거
  for (const attr of Object.keys(originOldProps)) {
    if (originNewProps[attr] !== undefined || attr.startsWith("on")) {
      console.log("111111");
      continue;
    } else {
      console.log("2222222");
      target.removeAttribute(attr);
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  console.log("updateElement start");
  console.log("parentElement: ", parentElement.innerHTML);
  console.log("newNode: ", newNode);
  console.log("oldNode: ", oldNode);

  // type , props, children 순으로 비교하고, 필요한 부분 업데이트? 하면 된다.

  // 1. oldNode만 있는 경우: node제거
  // 재귀로 돌면서 확인
  if (!newNode && oldNode) {
    return parentElement.removeChild(parentElement.childNodes[index]);
  }

  // 2. newNode만 있는 경우
  // 재귀로 돌면서 확인
  if (newNode && !oldNode) {
    console.log("newNode만 있는 경우");

    return parentElement.appendChild(createElement(newNode));
  }

  // 3. oldNode와 newNode 모두 text 타입일 경우
  if (typeof newNode === "string" && typeof oldNode === "string") {
    console.log("3. oldNode와 newNode 모두 text 타입일 경우");
    if (newNode === oldNode) return;
    return parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
  }

  // 4. oldNode와 newNode의 태그 이름(type)이 다를 경우
  if (oldNode.type !== newNode.type) {
    parentElement.replaceChild(
      createElement(newNode),
      parentElement.childNodes[index],
    );
    return;
  }
  console.log("newNode555: ", newNode.props || {});
  console.log("oldNode555å: ", oldNode.props || {});
  // 5. 두 노드가 같은 타입의 객체인 경우: 속성 업데이트 및 자식 비교
  updateAttributes(
    parentElement.childNodes[index],
    newNode.props || {},
    oldNode.props || {},
  );

  // 6. newNode와 oldNode의 모든 자식 태그를 순회하며 1 ~ 5의 내용을 반복한다.
  const maxLength = Math.max(
    newNode.children ? newNode.children.length : 0,
    oldNode.children ? oldNode.children.length : 0,
  );
  console.log("maxLength: ", maxLength);

  for (let i = 0; i < maxLength; i++) {
    console.log("[-", i, "]: ", parentElement.childNodes[index].innerHTML);

    updateElement(
      parentElement.childNodes[index],
      newNode.children[i],
      oldNode.children[i],
      i,
    );
  }
}
