export const treatAsBlank = (value) =>
  typeof value === "undefined" || value === null || typeof value === "boolean";

export const isEvent = (propKey) => propKey.startsWith("on");
export const extractEventKey = (propKey) => propKey.slice(2).toLowerCase();
