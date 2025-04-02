import { VNodeChild, Props, Component } from "./types";

export function createVNode(
  type: string | Component,
  props: Props,
  ...children: VNodeChild[]
) {
  return {
    type,
    props,
    children: flattenChildren(children),
  };
}

function flattenChildren(children: VNodeChild[]): VNodeChild[] {
  return children.reduce<VNodeChild[]>((flat, child) => {
    if (child === null || child === undefined || child === false) return flat;
    return flat.concat(Array.isArray(child) ? flattenChildren(child) : child);
  }, []);
}
