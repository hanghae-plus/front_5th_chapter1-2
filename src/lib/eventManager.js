/* eventStore 예시
const btn1 = document.querySelector("#btn1");
const btn2 = document.querySelector("#btn2");

addEvent(btn1, "click", () => console.log("clicked btn1"));
addEvent(btn2, "click", () => console.log("clicked btn2"));

eventStore = {
  click: Map {
    btn1 => () => console.log("clicked btn1"),
    btn2 => () => console.log("clicked btn2")
  }
}
*/

const eventStore = {};

export function setupEventListeners(root) {
  if (!root) return;

  Object.keys(eventStore).forEach((eventType) => {
    root.removeEventListener(eventType, handleEvent);
    root.addEventListener(eventType, handleEvent);
  });
}

function handleEvent(event) {
  const { type, target } = event;
  const store = eventStore[type];
  if (!store) return;

  for (const [el, handler] of store.entries()) {
    if (el === target || el.contains(target)) {
      handler(event);
    }
  }
}

export function addEvent(element, eventType, handler) {
  if (!eventStore[eventType]) {
    eventStore[eventType] = new Map();
  }
  eventStore[eventType].set(element, handler);
}

export function removeEvent(element, eventType, handler) {
  const store = eventStore[eventType];
  if (!store) return;

  const storedHandler = store.get(element);
  if (storedHandler === handler) {
    store.delete(element);
  }
}
