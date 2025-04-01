import { VNode } from "../types";

class VDomStore {
  private vDom: VNode | null = null;

  private constructor() {}

  public static build() {
    return new VDomStore();
  }

  public saveVDom(vDom: VNode) {
    this.vDom = vDom;
  }
  public get(): VNode | null {
    return this.vDom;
  }
  public hasVDom(): boolean {
    return this.vDom !== null;
  }
  public removeVDom(): void {
    this.vDom = null;
  }

  public clear(): void {
    this.vDom = null;
  }
}

export const vDomStore = VDomStore.build();
