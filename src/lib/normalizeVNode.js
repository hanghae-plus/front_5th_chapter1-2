export function normalizeVNode(vNode) {
  console.log("normalizeVNode:", vNode);
  if (vNode == undefined || vNode == null || typeof vNode == "boolean") {
    console.log("여기는 다 빈값으로 가는거야");
    return "";
  }

  if (typeof vNode == "string" || typeof vNode == "number") {
    return vNode.toString();
  }

  if (typeof vNode.type == "function") {
    console.log("여기는 함수형 컴포넌트로 가는거야");
    // const props = vNode.props || {};
    console.log("vNode.props:", vNode.props);
    // const props = { ...vNode.props };

    // if(vNode.children) {
    //   props.children = vNode.children;
    //   console.log('props.children:', props.children);
    // }

    //vNode.type 만 보면 그냥 [Function: UnorderedList] 이렇게만 나오는ㄷ ㅔ실행시키면 된다.
    // const renderedVNode = vNode.type(props);
    // console.log("renderedVNode:", renderedVNode);

    return normalizeVNode(
      vNode.type({
        ...vNode.props,
        children: vNode.children,
      }),
    ); // 재귀적으로 정규화
  }
  //둘다 아니면 vNode의 타입이 문자열이면 HTML 태그("div", "ul", "li")
  //vNode의 타입이 함수이면 함수형 컴포넌트
  //vNode.props.children을 정규화하면서 각각의 자식들을 변환해야 함

  // const { type, props } = vNode;
  // console.log("props:", props);
  // const children = props.children || [];
  // console.log("children:", children);
  // const normalizedChildren = Array.isArray(children)
  //   ? children.map((child, index) => {
  //       console.log(`자식 요소 ${index}:`, child);
  //       return normalizeVNode(child);
  //     })
  //   : [normalizeVNode(children)];

  return {
    type: vNode.type,
    props: vNode.props,
    children: Array.isArray(vNode.children)
      ? vNode.children.map(normalizeVNode).filter((node) => node !== "")
      : vNode.children,
  };
}
