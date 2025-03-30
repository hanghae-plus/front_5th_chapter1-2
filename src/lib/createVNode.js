/**
 * @param {*} type
 * @param {*} props
 * @param  {...any} children
 * @returns {*} 반환값은 {type, props, children 형태의 객체여야 합니다}
 */
export function createVNode(type, props, ...children) {
  let flatChildren = children
    .flat(Infinity)
    .filter((child) => child || child === 0);
  // console.log(flatChildren);
  return {
    type,
    props,
    children: flatChildren,
  };
}
