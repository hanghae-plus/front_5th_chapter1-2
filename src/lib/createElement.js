import { isEmpty } from "../utils";
// import { addEvent } from "./eventManager";

/**
 * vNode 객체를 분석하여 Element로 변환하면될듯...?
 * 앞서 공부해본 바 vNode에서 Element로 생성되는 과정은 재귀적으로 이루어짐.
 * 왜냐면 자식요소가 얼마나 많을지 모르기때문에 자식요소만큼 map을 통하여 재귀적으로 createElement를 호출해야함.
 * 고로 내부에서 다시 createElement를 호출해야할듯?
 * @param { type, props, children } vNode
 */
export function createElement(vNode) {
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode.toString());
  }
  if (isEmpty(vNode)) {
    return document.createTextNode("");
  }
  const $el = document.createElement(vNode.type);
  const fragment = document.createDocumentFragment();
  if (vNode.props) {
    updateAttributes($el, vNode.props);
  }
  if (vNode.children) {
    if (Array.isArray(vNode.children)) {
      const children = vNode.children.map(createElement).flat();
      children.forEach((child) => {
        fragment.appendChild(child);
      });
    }
  }
  $el.appendChild(fragment);
  return $el;
}

// element에 props에 저장된 속성을 추가해야함.
// props는 객체이기때문에 이를 setAttribute가 이해할수 있도록 (key, value) 형태로 변환해야함.
// Object.entries를 사용하면 (key, value) 형태로 변경하여 $el을 수정함(얕은복사)
// 값이 존재하는 props만 필터링 처리하여 setAttribute를 호출함.
/**
 *
 * @param {HTMLElement} $el
 * @param {object} props
 */
function updateAttributes($el, props) {
  Object.entries(props)
    .filter(([key, value]) => key && value)
    .forEach(([key, value]) => {
      return $el.setAttribute(key, value);
    });
}

// console.log(vNode);
//   // TypeError: Cannot convert undefined or null to object 타입에러 발생
//   // vNode가 더이상 요소로 쪼갤수없는 문자열 일때 해당 처리
//   if (typeof vNode === "string") {
//     return document.createTextNode(vNode);
//   }
//   if (typeof vNode === "number") {
//     return document.createTextNode(vNode);
//   }
//   if (typeof vNode === "boolean") {
//     return document.createTextNode("");
//   }
//   if (typeof vNode === "undefined") {
//     return document.createTextNode("");
//   }
//   if (typeof vNode.type === "function") {
//     // 컴포넌트인 경우 props가 없음. 빈 객체임.
//     // createElement로 호출.
//     if (Object.keys(vNode.props).length === 0) {
//       return createElement(vNode.type());
//     } else {
//       // vNode.children 을 어떻게 넘겨줘야할지 고민해야함.
//       return createElement(
//         vNode.type({
//           onClick: addEvent,
//           children: vNode.children[0],
//           props: vNode.props,
//         }),
//       );
//     }
//   }
//   const $el = document.createElement(vNode.type);
//   updateAttributes($el, vNode.props);
//   if (vNode.children) {
//     // 0331 현재 에러 발생
//     // InvalidCharacterError: Failed to execute 'createElement' on 'Document': The tag name provided
//     // 위 에러가 생긴이유는 type이 function인 경우, 즉 컴포넌트가 온 경우 createElement에 타입이 잘못되었기때문에 생긴 에러
//     // vNode의 type이 function인경우도 처리해줘야함.
//     const children = vNode.children.map(createElement).flat();

//     children.forEach((child) => {
//       $el.appendChild(child);
//     });
//   }
//   return $el;
