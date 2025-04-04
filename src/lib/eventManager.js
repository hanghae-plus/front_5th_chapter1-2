const eventRegistry = new WeakMap();
//WeakMap은 객체(특히 DOM 요소)를 키로 사용할 수 있는 Map.
//**자동으로 메모리 정리(GC)**도 되기 때문에 메모리 누수 걱정이 없음.

const eventLists = ["click", "submit"];

export function setupEventListeners(root) {
  eventLists.forEach((type) => {
    root.addEventListener(type, (event) => {
      let el = event.target;

      while (el && el !== root) {
        const events = eventRegistry.get(el);
        if (events && events[type]) {
          events[type].forEach((fn) => fn(event));
          break;
        }
        el = el.parentNode;
      }
    });
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventRegistry.has(element)) {
    eventRegistry.set(element, {});
  }
  const events = eventRegistry.get(element);
  if (!events[eventType]) {
    events[eventType] = [];
  }
  events[eventType].push(handler);
}

export function removeEvent(element, eventType, handler) {
  const events = eventRegistry.get(element);
  if (!events || !events[eventType]) return;

  events[eventType] = events[eventType].filter((fn) => fn !== handler);
}
