export type HTMLEventType = keyof HTMLElementEventMap;
export type HTMLTagType = keyof HTMLElementTagNameMap;
// * preact.VNode<P>
// export interface VNode<P = {}> extends preact.VNode<P> {
//   type: (string & { defaultProps: undefined }) | ComponentType<P>;
//   props: P & { children: ComponentChildren };
//   ref?: Ref<any> | null;
//   _children: Array<VNode<any>> | null;
//   _parent: VNode | null;
//   _depth: number | null;
//   _dom: PreactElement | null;
//   _component: Component | null;
//   constructor: undefined;
//   _original: number;
//   _index: number;
//   _flags: number;
// }
export interface VNode<T = {}> {
  type: HTMLTagType | Function | null;
  props: Record<string, any> | null;
  children: Array<VNode<any> | string>;
  parent?: VNode | null;
}

export interface ElementWithHandlers extends HTMLElement {
  handlers?: {
    [eventType in HTMLEventType]?: Array<(event: Event) => void>;
  };
}
