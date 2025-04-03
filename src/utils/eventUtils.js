const eventHandlers = {};

const handleGlobalEvents = (e) => {
  const handlers = eventHandlers[e.type];
  if (!handlers) return;

  for (const selector in handlers) {
    if (e.target.matches(selector)) {
      handlers[selector](e);
      break;
    }
  }
};

export const registerGlobalEvents = (() => {
  let init = false;
  return () => {
    if (init) {
      return;
    }

    Object.keys(eventHandlers).forEach((eventType) => {
      document.body.addEventListener(eventType, handleGlobalEvents);
    });

    init = true;
  };
})();

export const addEvent = (eventType, selector, handler) => {
  if (!eventHandlers[eventType]) {
    eventHandlers[eventType] = {};
  }
  eventHandlers[eventType][selector] = handler;
};

/**
 * 이벤트 핸들러 여부 확인
 * @param {string} attr 속성
 * @param {*} handler 값
 * @returns {boolean} 이벤트 핸들러 여부
 */
export function isAttrEventHandler(attr, handler) {
  return attr.startsWith("on") && typeof handler === "function";
}

/**
 * 이벤트 타입 가져오기
 * @description 이벤트 타입을 소문자로 변환하고 "on"을 제거한 후 반환
 * @param {string} eventType 이벤트 타입
 * @returns {string} 이벤트 타입
 * @example
 * getEventType("onClick") // "click"
 * getEventType("onMouseEnter") // "mouseenter"
 * getEventType("onMouseLeave") // "mouseleave"
 * getEventType("onMouseMove") // "mousemove"
 * getEventType("onMouseDown") // "mousedown"
 * getEventType("onMouseUp") // "mouseup"
 */
export function getEventType(eventType) {
  return eventType.toLowerCase().substring(2);
}
