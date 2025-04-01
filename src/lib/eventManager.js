export function setupEventListeners(root) {
  if (!root) return;

  const elements = root.querySelectorAll("*");

  elements.forEach((element) => {
    const eventType = element["custom-event-type"];
    const handler = element["custom-event-handler"];

    if (!eventType || !handler) return;

    root.addEventListener(eventType, (e) => {
      if (element === e.target) {
        handler(e);
      }
    });
  });
}

export function addEvent(element, eventType, handler) {
  if (!element || !eventType || !handler) return;

  element["custom-event-type"] = eventType;
  element["custom-event-handler"] = handler;
}

export function removeEvent(element, eventType, handler) {
  if (!element || !eventType || !handler) return;

  const elements = document.querySelectorAll("*");

  elements.forEach((element) => {
    const customEventType = element["custom-event-type"];
    const customEventHandler = element["custom-event-handler"];

    if (customEventType === eventType && customEventHandler === handler) {
      element["custom-event-type"] = null;
      element["custom-event-handler"] = null;

      element.addEventListener(eventType, (e) => {
        e.stopPropagation();
      });
    }
  });
}
