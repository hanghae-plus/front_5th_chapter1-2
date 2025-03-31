export function TextNode(text) {
  return {
    type: "text",
    content: String(text),
  };
}
