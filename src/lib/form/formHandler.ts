import { clearValue } from "../dom";

export class FormHandler {
  withPreventDefault(handler: (e: SubmitEvent) => void) {
    return (e: SubmitEvent) => {
      e.preventDefault();
      handler(e);
    };
  }

  withInputClear(elementId: string) {
    return (handler: (e: SubmitEvent) => void) => {
      return (e: SubmitEvent) => {
        handler(e);
        clearValue(elementId);
      };
    };
  }

  protected getFormData<T>(form: HTMLFormElement): T {
    return Object.fromEntries(new FormData(form)) as T;
  }
}
