import { HTMLTagType, VNode } from "../types";

export function createVNode(
  type: HTMLTagType,
  props: Record<string, any>,
  ...children: VNode[]
): VNode {
  return {
    type,
    props,
    children: children
      .flat(Infinity)
      .filter(
        (child: unknown) =>
          child !== null &&
          child !== undefined &&
          child !== false &&
          child !== true,
      ),
  };
}
