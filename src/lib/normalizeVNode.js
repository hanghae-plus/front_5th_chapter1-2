// export function normalizeVNode(vNode) {
//   if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
//     vNode = "";
//     return vNode;
//   }

//   // typeof는 항상 문자열을 반환한다.
//   if (typeof vNode === "string" || typeof vNode === "number") {
//     return String(vNode);
//   }

//   // console.log(vNode);
//   // console.log(vNode.type);

//   if (Array.isArray(vNode)) {
//     return vNode
//       .flat()
//       .map(normalizeVNode)
//       .filter((node) => node !== "");
//   }

//   if (typeof vNode.type === "function") {
//     // console.log('testing');
//     // return createVNode(vNode.type, vNode.type.props, vNode.children);

//     // 함수형 컴포넌트가 반환하는 객체 처리
//     // @_PURE_ 어쩌구일때는 파라미터가 function을 추가해주면 예외를 방지할 수 있다.
//     // if (typeof component === 'function') {
//     //   return component({ ...props, children });
//     // }

//     // const element = vNode.type({
//     //   ...vNode.props, // props 전달
//     //   children: vNode.children, // chidren 전달
//     // });

//     // return normalizeVNode(element);

//     return normalizeVNode(
//       vNode.type({
//         ...vNode.props,
//         children: vNode.children,
//       }),
//     );
//   }

//   // return {
//   //   type: vNode.type,
//   //   props: vNode.props,
//   //   children: vNode.children
//   //     .map(normalizeVNode)
//   //     .filter((child) => child !== ""),
//   // };

//   return {
//     type: vNode.type,
//     props: vNode.props,
//     children: Array.isArray(vNode.children)
//       ? vNode.children.map(normalizeVNode).filter((node) => node !== "")
//       : vNode.children,
//   };
// }

export function normalizeVNode(vNode) {
  // 1. 기본 타입 처리: null, undefined, boolean -> 빈 문자열
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  // 2. 원시 타입 처리: string, number -> 문자열
  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  // 3. 배열 처리: 각 요소를 정규화하고 빈 문자열 제거
  if (Array.isArray(vNode)) {
    return vNode
      .flat()
      .map(normalizeVNode)
      .filter((node) => node !== "");
  }

  // 4. 컴포넌트 처리: 컴포넌트 함수를 실행하고 결과를 정규화
  if (typeof vNode.type === "function") {
    return normalizeVNode(
      vNode.type({
        ...vNode.props,
        children: vNode.children,
      }),
    );
  }

  // 5. 일반 엘리먼트의 자식 노드 처리
  return {
    type: vNode.type,
    props: vNode.props,
    children: Array.isArray(vNode.children)
      ? vNode.children.map(normalizeVNode).filter((node) => node !== "")
      : vNode.children,
  };
}
