export function setupEventListeners(root) {
  // console.log(root);

  root.addEventListener("click", (event) => {
    if (event.target.dataset.event) {
      const handlerName = event.target.dataset.event;
      const handler = eventHandlers[handlerName];
      if (handler) {
        handler(event);
      }
    }
  });
}

// 이벤트 핸들러를 등록할 객체
const eventHandlers = {};

export function addEvent(element, eventType, handler) {
  // console.log('element >>>');
  // console.log(element);
  // console.log('eventType >>>');
  // console.log(eventType);
  // console.log('handler >>>');
  // console.log(handler);

  const handlerName = `${eventType}-${Math.random().toString(36).substr(2, 9)}`;
  eventHandlers[handlerName] = handler;

  // 요소에 이벤트 핸들러 이름을 data-event 속성으로 추가
  element.dataset.event = handlerName;
}

export function removeEvent(element, eventType, handler) {
  // console.log('element >>>');
  // console.log(element);
  // console.log('eventType >>>');
  // console.log(eventType);
  // console.log('handler >>>');
  // console.log(handler);
  const handlerName = element.dataset.event;

  // 해당 핸들러가 존재하면 제거
  if (handlerName && eventHandlers[handlerName] === handler) {
    delete eventHandlers[handlerName];
    delete element.dataset.event; // 요소에서 data-event 제거
  }
}

// const oneTimeHandler = (e) => {
//     handler(e);
//     element.removeEventListener(eventType, oneTimeHandler);
// }

// element.addEventListener(eventType, oneTimeHandler);
