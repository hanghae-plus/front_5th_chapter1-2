import { flatDeep, treatAsBlank } from "../utils";

export function createVNode(type, props, ...children) {
  return {
    type,
    props,
    children: flatDeep(children).filter((child) => !treatAsBlank(child)),
  };
}
