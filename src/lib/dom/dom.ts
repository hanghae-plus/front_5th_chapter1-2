type ElementType = HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement;

export const getElement = <T extends ElementType>(id: string): T => {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Element with id '${id}' not found`);
  }
  return element as T;
};

export const getValue = (id: string): string => {
  const element = getElement<HTMLInputElement | HTMLTextAreaElement>(id);
  return element.value;
};

export const setValue = (id: string, value: string): void => {
  const element = getElement<HTMLInputElement | HTMLTextAreaElement>(id);
  element.value = value;
};

export const clearValue = (id: string): void => {
  setValue(id, "");
};
