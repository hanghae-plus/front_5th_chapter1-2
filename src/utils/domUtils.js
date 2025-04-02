export const getDomAttributeName = (key) => {
  const attributes = {
    className: "class",
    htmlFor: "for",
    httpEquiv: "http-equiv",
    acceptCharset: "accept-charset",
    autoComplete: "autocomplete",
    noValidate: "novalidate",
    readOnly: "readonly",
    maxLength: "maxlength",
    minLength: "minlength",
    tabIndex: "tabindex",
    crossOrigin: "crossorigin",
  };

  return attributes[key] || key;
};

export const getPropNameFromAttr = (attrName) => {
  const props = {
    class: "className",
    for: "htmlFor",
    "http-equiv": "httpEquiv",
    "accept-charset": "acceptCharset",
    autocomplete: "autoComplete",
    novalidate: "noValidate",
    readonly: "readOnly",
    maxlength: "maxLength",
    minlength: "minLength",
    tabindex: "tabIndex",
    crossorigin: "crossOrigin",
  };

  return props[attrName] || attrName;
};
