export type VNodeChild = string | number | boolean | null | undefined | VNode;

export type Props = Record<string, any> | null;

export type Component = (props: Props) => VNode | string;

export interface VNode {
  type: string | Component;
  props: Props;
  children: VNodeChild[];
}
