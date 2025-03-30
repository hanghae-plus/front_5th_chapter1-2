/**
 * @param {keyof HTMLElementTagNameMap} type - 노드의 영문명
 * @param {Object} props - 노드의 속성
 * @param {...any} children - 노드의 자식
 * @returns {{
 *  type: keyof HTMLElementTagNameMap,
 *  props: Object,
 *  children: any[]
 * }} VNode
 */
export function createVNode(type, props, ...children) {
  const flattenChildren = children.flat(Infinity);

  return {
    type,
    props,
    children: flattenChildren,
  };
}
