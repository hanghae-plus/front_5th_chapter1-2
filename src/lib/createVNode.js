export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: children.flat(Infinity).filter((v) => v === 0 || Boolean(v)),
    // 평탄화
    // .flat(Infinity)

    // 조건부 렌더링
    // .filter(Boolean) : truthy한 값 반환
    // .filter((v) => v === 0 || Boolean(v)) : 0 포함
  };
}
