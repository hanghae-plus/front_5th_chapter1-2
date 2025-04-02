import { RawVNode, Props, Component } from "./types";

export function createVNode(
  type: string | Component,
  props: Props,
  ...children: RawVNode[]
) {
  return {
    type,
    props,
    children: flattenChildren(children),
  };
}

function flattenChildren(children: RawVNode[]): RawVNode[] {
  return children.reduce<RawVNode[]>((flat, child) => {
    if (child === null || child === undefined || child === false) return flat;
    return flat.concat(Array.isArray(child) ? flattenChildren(child) : child);
  }, []);
}
