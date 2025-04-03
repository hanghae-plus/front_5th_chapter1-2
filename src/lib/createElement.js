import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode.toString());
  }

  if (Array.isArray(vNode)) {
    const fragment = {
      //nodeType이랑 childNodes는 DOM API에서 사용하는 프로퍼티
      // 내가 맘대로 지어도 되는게 아니네 테스트코드 참조
      nodeType: Node.DOCUMENT_FRAGMENT_NODE,
      childNodes: [],
    };
    vNode.map((child) => {
      fragment.childNodes.push(document.createElement(child.type));
    });
    return fragment;
  }

  //createElement 구조
  //   type: 'button',
  //   props: {
  // props의 이 부분이 아마 이벤트가 표출되는 예시.
  //     onClick: handleClick, // ← 이거!
  //   },
  //   children: ['클릭']
  // }

  console.log("createElement vNode:", vNode);
  // 기본 구조 처리
  const $el = document.createElement(vNode.type);

  // props 처리
  for (const [key, value] of Object.entries(vNode.props || {})) {
    console.log("key:", key);
    if (key === "className") {
      $el.setAttribute("class", value);
    } else if (key.startsWith("on") && typeof value === "function") {
      // 이벤트 처리
      const eventType = key.slice(2).toLowerCase();
      // 이벤트 등록
      addEvent($el, eventType, value);
    } else {
      $el.setAttribute(key, value);
    }
  }

  // 자식 처리
  for (const child of vNode.children || []) {
    $el.appendChild(createElement(child));
  }

  return $el;
}
