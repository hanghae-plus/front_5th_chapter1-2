export type HTMLEventType = keyof HTMLElementEventMap;
export type HTMLTagType = keyof HTMLElementTagNameMap;

export interface VNode {
  type: HTMLTagType | Function | null;
  props: Record<string, any>;
  children: (VNode | string)[];
}
export interface ElementWithHandlers extends HTMLElement {
  _handlers?: {
    [eventType: string]: Array<(event: Event) => void>;
  };
}
