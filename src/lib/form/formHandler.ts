export type FormHandler = {
  handleSubmit: (e: Event) => void;
};

export const withPreventDefault = (handler: (e: Event) => void) => {
  return (e: Event) => {
    e.preventDefault();
    handler(e);
  };
};

export const withInputClear =
  (elementId: string) => (handler: (e: Event) => void) => {
    return (e: Event) => {
      handler(e);
      const element = document.getElementById(elementId) as
        | HTMLInputElement
        | HTMLTextAreaElement;
      if (element) element.value = "";
    };
  };
