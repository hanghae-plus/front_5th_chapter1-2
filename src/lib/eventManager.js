export function setupEventListeners(root) {
  console.log(root);
}

class EventListenerStore {
  constructor() {
    if (EventListenerStore.instance) {
      return EventListenerStore.instance;
    }
    this.listeners = {};
    EventListenerStore.instance = this;
  }

  getEventListenerKey(eventType, element) {
    return `${eventType}_${element.tagName}`;
  }

  get(key) {
    return this.listeners[key];
  }

  set(key, value) {
    this.listeners[key] = value;
  }
}

const eventListeners = new EventListenerStore();

export function addEvent(element, eventType, handler) {
  function listener(event) {
    if (event.target.tagName === element.tagName) {
      handler();
    }
  }
  eventListeners.set(
    eventListeners.getEventListenerKey(eventType, element),
    listener,
  );
  document.body.addEventListener(eventType, listener);
}

export function removeEvent(element, eventType) {
  document.body.removeEventListener(
    eventType,
    eventListeners.get(eventListeners.getEventListenerKey(eventType, element)),
  );
}
