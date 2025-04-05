import { addEvent } from "./eventManager";

export function createElement(vNode) {
  // if (
  //   vNode === undefined ||
  //   vNode === null ||
  //   vNode === false ||
  //   vNode === true
  // ) {
  //   vNode = "";
  //   return document.createTextNode(vNode);
  // }

  // if (typeof vNode === "string" || typeof vNode === "number") {
  //   return document.createTextNode(vNode);
  // }

  // // if(Array.isArray(vNode)) {
  // //   // console.log(vNode.childNodes);
  // //   // console.log(vNode);
  // //   // node.children.forEach((child) => element.appendChild(createElement(child)));

  // if (Array.isArray(vNode)) {
  //   const element = document.createDocumentFragment(); // DocumentFragment를 생성
  //   vNode.forEach((child) => {
  //     element.appendChild(createElement(child));
  //   }); // 각 자식에 대해 createElement를 재귀 호출하여 추가
  //   return element;
  // }

  // // 멘토링 : 왜 vNode.children이 아닌가..

  // const element = document.createElement(vNode.type);
  // updateAttributes(element, vNode.props);

  // vNode.children.forEach((child) => {
  //   element.appendChild(createElement(child));
  // });
  // return element;

  if (vNode === undefined || vNode === null || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  if (Array.isArray(vNode)) {
    const fragment = {
      nodeType: Node.DOCUMENT_FRAGMENT_NODE,
      childNodes: [],
    };
    vNode.forEach((child) => {
      fragment.childNodes.push(document.createElement(child.type));
    });
    return fragment;
  }

  if (typeof vNode.type === "function") {
    throw new Error();
  }

  const $el = document.createElement(vNode.type);
  if (vNode.props) {
    Object.entries(vNode.props).forEach(([key, value]) => {
      if (key === "className") {
        $el.setAttribute("class", value);
      } else if (key.startsWith("on")) {
        addEvent($el, key.slice(2).toLowerCase(), value);
      } else {
        $el.setAttribute(key, value);
      }
    });
  }
  vNode.children.forEach((child) => {
    $el.appendChild(createElement(child));
  });

  return $el;
}

// function updateAttributes($el, props) {
//   // if (props) {
//   //   Object.entries(props).forEach(([key, value]) => {
//   //     if (key === "className") {
//   //       $el.setAttribute("class", value);
//   //     } else if (key.startsWith("on")) {
//   //       addEvent($el, value);
//   //     } else {
//   //       $el.setAttribute(key, value);
//   //     }
//   //   });
//   // }
// }

// https://velog.io/@sj_yun/React-%EC%97%86%EC%9D%B4-JSX%EC%99%80-Virtual-DOM%EC%9C%BC%EB%A1%9C-%EB%A0%8C%EB%8D%94%EB%A7%81%ED%95%98%EA%B8%B0
