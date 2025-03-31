export function setupEventListeners(root) {
  console.log(root);
}

export function addEvent(element, eventType, handler) {
  element.addEventListener(eventType, handler);
}

export function removeEvent(element, eventType, handler) {
  console.log(element, eventType, handler);
}
