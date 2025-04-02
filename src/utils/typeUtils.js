export const isEmptyStrType = (val) => {
  return val === null || typeof val === "undefined" || typeof val === "boolean";
};

export const isNumericOrStr = (val) => {
  return !isNaN(Number(val)) || typeof val === "string";
};
