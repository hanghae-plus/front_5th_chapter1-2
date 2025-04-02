import { VNode } from "../types";

export const isEmptyNodeValue = (
  vNode: VNode | boolean | string | number | null | undefined,
): boolean => {
  return (
    vNode === undefined || vNode === null || vNode === false || vNode === true
  );
};

export const isValidVNode = (
  vNode: VNode | boolean | string | null,
): vNode is VNode => {
  return typeof vNode === "object" && vNode !== null && "type" in vNode;
};
