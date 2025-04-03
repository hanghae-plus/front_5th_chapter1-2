// renderElement할 때, 실제 HTMLElement Dom에 등록 됨
// 등록 후 setupEventListener
// 를 통해서 dom tree에서 사용되는 이베트들을
// root요소에 위임하는 형태로 진행됩니다
// 미리 어딘가에 정보를 저장하고 있어야하는데
// addEvent로 dom tree에 어떤 이벤트들이 사용되는지 저장합니다
// 저장하고 있던 이벤트를 토대로
// setupEvent할때
// addEvent 사용위치가 createElement
// updateAttriebtes
// conponent 사용할때 이벤트를 넣으려면
// onClick
// onSubmit
// addEvent 를 통해서 다른곳에 handler을 저장한다

// handlersMap은 addEvent 호출하면 매개변수에 담긴 파라미터들을 가지고 저장한다.
// const handlersMap = {}
// {
//     button: [ click, ]
//    }

//    {
//     button: [click, focus]
//    }

//    {
//     button: [ ...생략 ],
//     form: [ submit ]
//    }

//    addEventListener로 등록을한다

// 저기 handlersmap 에 저장된 click이라던가 submit들을
// setupeventlist의 addEventListener로 등록을한다

// addEvent()로 들어온 매개변수들을 여기 맵에다가 저장
const handlersMap = new Map();

// 지원할 이벤트 타입들 (테스트에서 사용하는 이벤트들)
// const eventTypes = ["click", "mouseover", "focus", "keydown"];
const eventTypes = new Set();

let _root;
function eventHandler(event) {
  console.log(`${event.type} 이벤트 발생!!!!!!`); // 이벤트 발생시 로그

  let target = event.target;

  // 이벤트 버블링: 클릭된 요소부터 시작해서 부모로 올라가며 핸들러 찾기
  while (target && target !== _root) {
    // 이 요소에 핸들러가 등록되어 있는지 확인
    if (handlersMap.has(target)) {
      const elementEvents = handlersMap.get(target);

      // 이벤트 핸들러가 있으면 실행하고 종료
      if (elementEvents?.has(event.type)) {
        elementEvents.get(event.type)(event);
        break;
      }
    }

    // 부모 요소로 이동 (버블링)
    target = target.parentElement;
  }
}

// addEvent로 dom tree에 어떤 이벤트들이 사용되는지 저장합니다
export function setupEventListeners(root) {
  _root = root;

  eventTypes.forEach((eventType) => {
    console.log(`이벤트 타입 처리: ${eventType}`);

    root.removeEventListener(eventType, eventHandler);
    root.addEventListener(eventType, eventHandler);
    console.log(`${eventType} 이벤트 리스너 추가 완료`);
  });
  console.log("setupEventListeners 완료");
  console.groupEnd();
}

// 특정 DOM요소에 이벤트 핸들러를 등록
export function addEvent(element, eventType, handler) {
  console.log("addEvent");

  // 이벤트 핸들러에 등록
  //   handlersMap.set(element, eventType);
  eventTypes.add(eventType);
  if (!handlersMap.has(element)) {
    handlersMap.set(element, new Map());
  }

  const elementEvents = handlersMap.get(element);
  if (!elementEvents.has(eventType)) {
    console.log("이벤트 핸들러 등록: ", eventType);

    elementEvents.set(eventType, handler);
  }

  // elementEvents.get(eventType).push(handler);
}

// 등록된 이벤트 핸들러를 제거
export function removeEvent(element, eventType) {
  const elementHandlers = handlersMap.get(element);
  if (elementHandlers.has(eventType)) {
    console.log("remove evnet type : ", eventType);
    elementHandlers.delete(eventType);
  }
}
