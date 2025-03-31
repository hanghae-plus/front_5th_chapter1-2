import { HTMLTagType, VNode } from "../types";

export function createVNode(
  type: HTMLTagType,
  props: Record<string, any> | null,
  ...children: (VNode<any> | string | number | boolean | null | undefined)[]
): VNode<any> {
  return {
    type,
    props,
    children: children
      .flat(Infinity)
      .filter(
        (child) =>
          child !== null &&
          child !== undefined &&
          child !== false &&
          child !== true,
      ) as Array<VNode<any>>,
  };
}
