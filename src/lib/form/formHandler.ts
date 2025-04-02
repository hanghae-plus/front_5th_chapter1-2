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
        const element = document.getElementById(elementId) as
          | HTMLInputElement
          | HTMLTextAreaElement;
        if (element) element.value = "";
      };
    };
  }

  getFormData(form: HTMLFormElement) {
    return Object.fromEntries(new FormData(form));
  }
}
