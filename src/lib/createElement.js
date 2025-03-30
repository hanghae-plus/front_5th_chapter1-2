// TODO: 각각의 조건에 대해 element를 만드는 코드가 필요함
// import { addEvent } from "./eventManager";

export function createElement(vNode) {
  updateAttributes(vNode);
  return vNode;
}

function updateAttributes($el, props) {
  console.log($el, props);
}
