const eventTypeMap = new Map(); //eventType, $el
const handlerMap = new Map(); //$el, handler
let eventBundle = [];

export function setupEventListeners($root) {
  eventBundle.forEach((eventType) => {
    let el = eventTypeMap.get(eventType);

    $root.addEventListener(eventType, function (e) {
      if (e.target.isEqualNode(el)) {
        let handler = handlerMap.get(el);
        if (handler !== undefined) {
          handler();
        }
      }
    });
  });
}

/**elenet에 대한 이벤트 함수를 저장한다. */
export function addEvent($el, eventType, handler) {
  if (!eventBundle.includes(eventType)) {
    eventBundle.push(eventType);
  }

  eventTypeMap.set(eventType, $el);
  handlerMap.set($el, handler);
}

/**element에 대한 이벤트 함수를 삭제한다. */
export function removeEvent(element, eventType, handler) {
  if (!eventBundle.includes(eventType)) return;
  if (!handlerMap.get(element)) return; //elment에 매칭된 handler가 없으면 리턴합니다.
  if (!eventTypeMap.get(eventType)) return;

  handlerMap.forEach((h, $el) => {
    if (h === handler) {
      eventTypeMap.delete(eventType);
      handlerMap.delete($el);
    }
  });
}
