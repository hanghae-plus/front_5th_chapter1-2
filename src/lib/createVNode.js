export function createVNode(type, props, ...children) {
  function flattenChildren(children) {
    return children
      .filter((item) => item !== undefined && item !== null && item !== false)
      .reduce((flat, child) => {
        //첫번째 인자는 누적값 -> 초기값은 빈 배열이다.왜냐 [] 이렇게 초기값 설정함.
        if (Array.isArray(child)) {
          // 배열인 경우, 재귀적으로 평탄화
          flat.push(...flattenChildren(child));
        } else {
          flat.push(child);
        }
        return flat;
      }, []);
    //여기가 initialValue
  }

  // console.log("props:", props);
  // console.log("children:", ...children);

  return { type, props, children: flattenChildren(children) };
}
