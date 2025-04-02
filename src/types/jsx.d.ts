/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { VNode, Props } from "../lib/vdom/index";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: Props;
    }

    interface Element extends VNode {}
    interface ElementClass {}
    interface ElementAttributesProperty {
      props: {};
    }
  }
}
