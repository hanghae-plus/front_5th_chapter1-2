// TODO: 각각의 조건에 대해 element를 만드는 코드가 필요함
// import { addEvent } from "./eventManager";

export function createElement(vNode) {
  console.log("createElement", vNode);
  if (
    typeof vNode === "boolean" ||
    typeof vNode === "undefined" ||
    vNode === null
  ) {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    fragment.append(...vNode.map(createElement));
    return fragment;
  }

  const $el = document.createElement(vNode.type);

  Object.entries(vNode.props || {})
    .filter(([, value]) => value)
    .forEach(([attr, value]) => {
      console.log(attr, value);
      // TODO: attr format하는 함수 만들기
      if (attr === "className") {
        $el.setAttribute("class", value);
      } else {
        $el.setAttribute(attr, value);
      }
    });

  updateAttributes($el, vNode.props);

  vNode.children.map(createElement).forEach((child) => $el.appendChild(child));

  return $el;
}

function updateAttributes($el, props) {
  console.log($el, props);
}
