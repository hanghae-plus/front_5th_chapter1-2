export function setupEventListeners(root) {
  console.log(root);
}

const eventListeners = {};

function getEventListenerKey(eventType, element) {
  return `${eventType}_${element.tagName}`;
}
export function addEvent(element, eventType, handler) {
  function listener(event) {
    if (event.target.tagName === element.tagName) {
      handler();
    }
  }
  eventListeners[getEventListenerKey(eventType, element)] = listener;
  document.body.addEventListener(eventType, listener);
}

export function removeEvent(element, eventType) {
  document.body.removeEventListener(
    eventType,
    eventListeners[getEventListenerKey(eventType, element)],
  );
}
