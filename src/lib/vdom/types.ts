export type RawVNode = string | number | boolean | null | undefined | VNode;

export type Props = Record<string, any> | null;

export type Component = (props: Props) => VNode | string;

export type ElementType = keyof HTMLElementTagNameMap | Component;

export interface VNode {
  type: ElementType;
  props: Props;
  children: RawVNode[];
}
