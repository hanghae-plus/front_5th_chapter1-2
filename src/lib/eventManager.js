const eventStore = new WeakMap();
const eventTypes = new Set();

export function setupEventListeners(root) {
  // eventStore에 저장된 각 이벤트를 순회하며, root 내부에 있는 요소에 이벤트를 등록합니다.
  eventTypes.forEach((eventType) => {
    root.addEventListener(eventType, eventHandler);
  });
}

export function addEvent(element, eventType, handler) {
  eventTypes.add(eventType);
  // Map에 이벤트 정보를 저장합니다.
  if (!eventStore.has(element)) {
    eventStore.set(element, new Map());
  }
  const eventData = eventStore.get(element);
  eventData.set(eventType, handler);

  console.log("eventStore", eventStore);
  console.log("addEvent", element, eventType, handler);
}

export function removeEvent(element, eventType, handler) {
  if (!eventStore.has(element)) {
    return;
  }

  const eventData = eventStore.get(element);

  if (eventData.get(eventType) === handler) {
    eventData.delete(eventType);
  }

  eventData.delete(eventType);
  if (eventData.size === 0) {
    eventStore.delete(element);
  }
}

const eventHandler = (event) => {
  if (!eventStore.has(event.target)) {
    return;
  }
  const eventData = eventStore.get(event.target);
  const handler = eventData.get(event.type);
  if (handler) {
    handler.call(event.target, event);
  }
};
