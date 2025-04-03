/* 배열을 평탄화 시키는 이유? */
export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: children.filter((v) => v === 0 || Boolean(v)).flat(Infinity),
  };
}
