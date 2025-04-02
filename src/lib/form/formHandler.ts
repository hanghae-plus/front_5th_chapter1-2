import { clearValue } from "../dom";

export class FormHandler {
  withPreventDefault(handler: (e: Event) => void) {
    return (e: Event) => {
      e.preventDefault();
      handler(e);
    };
  }

  withInputClear(elementId: string) {
    return (handler: (e: Event) => void) => {
      return (e: Event) => {
        handler(e);
        clearValue(elementId);
      };
    };
  }

  protected getFormData<T>(form: HTMLFormElement): T {
    return Object.fromEntries(new FormData(form)) as T;
  }
}
