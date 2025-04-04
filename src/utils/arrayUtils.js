export const removeItem = (array, item) =>
  array.filter((element) => element !== item);

export const addItem = (array, item) => [...array, item];
