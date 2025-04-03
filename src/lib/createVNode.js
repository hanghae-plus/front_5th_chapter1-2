import { isValidChild } from "../utils/vNodeUtils";

export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: children.flat(Infinity).filter(isValidChild),
  };
}
