// import { createVNode } from "./createVNode";

export function normalizeVNode(vNode) {
  if (
    vNode === null ||
    vNode === undefined ||
    vNode === true ||
    vNode === false
  ) {
    vNode = "";
    return vNode;
  }

  // typeof는 항상 문자열을 반환한다.
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  // console.log(vNode);
  // console.log(vNode.type);

  if (typeof vNode.type === "function") {
    // console.log('testing');
    // return createVNode(vNode.type, vNode.type.props, vNode.children);

    // 함수형 컴포넌트가 반환하는 객체 처리
    // @_PURE_ 어쩌구일때는 파라미터가 function을 추가해주면 예외를 방지할 수 있다.
    // if (typeof component === 'function') {
    //   return component({ ...props, children });
    // }

    const element = vNode.type({
      ...vNode.props, // props 전달
      children: vNode.children, // chidren 전달
    });

    return normalizeVNode(element);
  }

  return {
    type: vNode.type,
    props: vNode.props,
    children: vNode.children
      .map(normalizeVNode)
      .filter((child) => child !== ""),
  };
}
