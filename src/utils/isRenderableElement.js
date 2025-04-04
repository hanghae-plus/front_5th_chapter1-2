const isRenderableElement = (v) => {
  if (v === null) return false;
  if (v === undefined) return false;
  if (v === false) return false;
  if (v === true) return false;
  return true;
};

export { isRenderableElement };
