// 이벤트 핸들러 맵 (전역 상태 관리)
// 이벤트위임의 핵심개념
// 1. document.addEventListener
// 2. 위임하고 자하는 태그를 가져와서 이벤트를 주입한다.

//저장하는 곳이 필요해. 왜 저장하는 곳이 필요한가?
// 이벤트 핸들러를 저장해야해, 그래야 원하는 곳에 부모요소가 전파를 해주겠지.
// 이벤트 위임은 각요소에 리스너를 붙이는 대신, 그 요소들의 부모에만 리스너를 붙인다. 버블링되서 전파된다.

// 이벤트 핸들러를 저장할 객체
const eventHandlers = new Map();

function handleEvent(event) {
  const target = event.target;

  if (eventHandlers.has(target) && eventHandlers.get(target).has(event.type)) {
    const handlers = eventHandlers.get(target).get(event.type);
    handlers.forEach((handler) => handler(event));
  }
}

export function setupEventListeners(root) {
  const eventTarget = ["click", "input", "change", "submit"];
  eventTarget.forEach((eventType) => {
    root.addEventListener(eventType, function (event) {
      //함수를 만들어야한다. event를 등록하는 함수.
      handleEvent(event);
    });
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventHandlers.has(element)) {
    eventHandlers.set(element, new Map());
  }

  const elementHandlers = eventHandlers.get(element);
  if (!elementHandlers.has(eventType)) {
    elementHandlers.set(eventType, []);
  }

  elementHandlers.get(eventType).push(handler);
}

export function removeEvent(element, eventType, handler) {
  element.removeEventListener(eventType, handler);
}
