const eventTypeMap = new Map(); //eventType, $el
const handlerMap = new Map(); //$el, handler

export function setupEventListeners(root) {
  //FIXME:root에서 이벤트 발생시, 함수실행을 통해 update된 Map가져오도록 수정
  let rootEventType;
  let rootHandler;
  eventTypeMap.forEach(($el, eventType) => {
    rootEventType = eventType;
    rootHandler = handlerMap.get($el);
  });
  root.addEventListener(rootEventType, function () {
    console.log("rootHandler", rootHandler);
    rootHandler();
  });
}

/**elenet에 대한 이벤트 함수를 저장한다. */
export function addEvent($el, eventType, handler) {
  console.log("addEvent", $el);
  if (eventTypeMap.get(eventType) === undefined) {
    eventTypeMap.set(eventType, $el);
  }
  if (handlerMap.get($el) === undefined) {
    handlerMap.set($el, handler);
  }
}

/**element에 대한 이벤트 함수를 삭제한다. */
export function removeEvent(element, eventType, handler) {
  if (!handlerMap.get(element)) return; //elment에 매칭된 handler가 없으면 리턴합니다.
  if (!eventTypeMap.get(eventType)) return;

  handlerMap.forEach((h, $el) => {
    if (h === handler) {
      console.log("h===handler");
      eventTypeMap.delete(eventType);
      handlerMap.delete($el);
    }
  });
}
/**
 *element eventType handler
 *button click A
 *div submit B
 *div submit C
 *span click D
 *
 * eventType은 따로 배열로 관리, 요소가 배열에 없을때만 push
 * element와 handler는 같이 묶어서 관리
 * 추가하는 경우 요소get해서 hadler와 비교후 없다면 담기
 *
 * (click, button), (button,A)
 *
 * click -> button A
 * click -> span D
 * submit -> div B
 * submit -> div C
 */
