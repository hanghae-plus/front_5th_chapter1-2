import { isRenderableElement } from "../utils/isRenderableElement";

export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: children.flat(2).filter(isRenderableElement),
  };
}
