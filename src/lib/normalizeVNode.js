export function normalizeVNode(vNode) {
  console.log("NormalizeVNode Start");
  console.log(`vNode00: ${vNode}`);
  // console.log(`vNode11: ${vNode}`);
  // console.log(`vNode22: ${typeof vNode}`);

  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }
  if (typeof vNode === "string" || typeof vNode === "number") {
    return vNode.toString();
  }
  if (typeof vNode === "object") {
    // console.log("여기오니?");
    const { type, props, children } = vNode;
    console.log("[type]:", type);
    console.log("[props]:", props);
    console.log("[children]:", children);
    if (typeof type === "function") {
      // console.log("여기오니2?");
      // console.log(`type() : ${type(props || {})}`);

      // 중요! props에 children 추가하기
      const propsWithChildren = { ...props };

      // children이 있으면 props에 전달
      if (children && children.length > 0) {
        propsWithChildren.children = children;
      }
      // for (let i = 0; i < children.length > 0; i++) {
      //   let props = children[i].props;
      //   console.log("aasdasda: ", children[i]);
      //   return normalizeVNode(children[i].type(props || {}));
      // }
      // if (Array.isArray(children) && children.length > 0) {
      //   return {
      //     ...vNode,
      //     children: vNode.children.map(normalizeVNode),
      //   };
      // }
      // const normalizedCHildren = children.map((child) => normalizeVNode(child));
      // console.log(normalizedCHildren.length);

      // console.log("normalized::: ", normalizedCHildren);

      // if (normalizedCHildren.length === 3) {
      //   console.log("adafssfs");
      //   let value = normalizedCHildren[0];

      //   console.log(normalizedCHildren[0].props);
      //   return {
      //     type: value.type,
      //     props: value.props,
      //     children: value.children,
      //   };
      // }

      // 함수를 호출하여 vNode 객체를 얻은 후 그 객체를 정규화
      return normalizeVNode(type(propsWithChildren || {}));
    }
    // 일반 DOM 요소 처리
    // 자식 노드들을 정규화하고 falsy 값 제거
    console.log("children: ", children);
    console.log("children.length: ", children.length);
    const normalizedChildren = Array.isArray(children)
      ? children
          .map((child) => normalizeVNode(child))
          .filter((child) => child !== "" && child !== null)
      : [];

    console.log("normalizedChildren: ", normalizedChildren);

    // 정규화된 vNode 반환
    return {
      type,
      props,
      children: normalizedChildren,
    };
  } else {
    return vNode;
  }

  // console.log("vNode0: ", vNode);
  // if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
  //   return "";
  // } else if (typeof vNode === "string" || typeof vNode === "number") {
  //   console.log(vNode.toString());
  //   return vNode.toString();
  // } else if (typeof vNode === "object") {
  //   console.log("여기오니 ?");
  //   normalizeVNode(type);
  //   if (typeof type === "function") {
  //     console.log("여기오니 ? 2");
  //   }
  // } else {
  //   return vNode;
  // }
  // return vNode === null || vNode === undefined || vNode || !vNode
  //   ? ""
  //   : vNode
  //     ? typeof vNode === "string" || vNode === "number"
  //     : vNode.toString();
}
