export const treatAsBlank = (value) =>
  typeof value === "undefined" || value === null || typeof value === "boolean";

export const isEvent = (propKey) => propKey.startsWith("on");
export const extractEventKey = (propKey) => propKey.slice(2).toLowerCase();

export const getAttributeKey = (key) => {
  if (key === "key") return null;
  if (key === "className") return "class";

  return key;
};
