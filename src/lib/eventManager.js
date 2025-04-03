const eventStore = new Map(); //이벤트 저장
const eventTypes = new Set(); //이벤트 타입 저장

export function setupEventListeners(root) {
  eventTypes.forEach((eventType) => {
    root.addEventListener(eventType, eventHandler);
  });
}

//이벤트 헨들러
function eventHandler(e) {
  const target = e.target;

  const handlerEvent = eventStore.get(target)?.get(e.type);
  handlerEvent?.(e);
}

export function addEvent(element, eventType, handler) {
  eventTypes.add(eventType);

  if (!eventStore.has(element)) {
    eventStore.set(element, new Map());
  }

  const elEvent = eventStore.get(element);
  elEvent.set(eventType, handler);
}

export function removeEvent(element, eventType, handler) {
  const isHandler = eventStore.get(element);
  if (isHandler.has(eventType)) {
    isHandler.delete(eventType);
  }
}
