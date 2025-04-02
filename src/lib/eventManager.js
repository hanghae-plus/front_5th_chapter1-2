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
const eventTypes = ["click", "mouseover", "focus", "keydown"];

// addEvent로 dom tree에 어떤 이벤트들이 사용되는지 저장합니다
export function setupEventListeners(root) {
  console.log("이벤트 리스너 설정 중...");
  console.log("root: ", root.innerHTML);
  // 이벤트 위임을 여기서 구현
  // root를 addEventListener로 등록을한다
  //   if(handlersMap.has())

  eventTypes.forEach((eventType) => {
    console.log("eventTypes: ", eventType);
    root.addEventListener(eventType, (event) => {
      let target = event.target;
      console.log("event: ", event);
      console.log("listener: ", target);

      // 이벤트 버블링: 클릭된 요소부터 시작해서 부모로 올라가며 핸들러 찾기
      while (target && target !== root) {
        // 이 요소에 핸들러가 등록되어 있는지 확인
        if (handlersMap.has(target)) {
          //   console.log("target: ", target);
          const elementEvents = handlersMap.get(target);
          console.log("elementEvents: ", elementEvents);

          // 해당 이벤트 타입의 핸들러가 있는지 확인
          if (elementEvents.has(eventType)) {
            // 등록된 모든 핸들러 실행
            const handlers = elementEvents.get(eventType);
            handlers.forEach((handler) => handler(event));
          }
        }

        // 부모 요소로 이동 (버블링)
        target = target.parentElement;
      }
    });
  });
}

// 특정 DOM요소에 이벤트 핸들러를 등록
export function addEvent(element, eventType, handler) {
  console.log("addEvent Start");

  // 이벤트 핸들러에 등록
  //   handlersMap.set(element, eventType);

  if (!handlersMap.has(element)) {
    handlersMap.set(element, new Map());
  }

  const elementEvents = handlersMap.get(element);
  if (!elementEvents.has(eventType)) {
    elementEvents.set(eventType, []);
  }

  elementEvents.get(eventType).push(handler);

  handlersMap.forEach((value, key) => {
    console.log("addEvent-HandlersMap: ", key.outerHTML, "::", value);
  });
}

// 등록된 이벤트 핸들러를 제거
export function removeEvent(element, eventType, handler) {
  console.log("removeEvent Start");
  //   console.log(handlersMap);
  //   console.log();
  // 1. 해당 요소가 맵에 있는지 확인
  if (!handlersMap.has(element)) {
    return; // 요소가 없으면 아무것도 하지 않음
  }

  const elementEvents = handlersMap.get(element);
  console.log("elementEvents: ", elementEvents);

  if (!elementEvents.has(eventType)) {
    return;
  }

  // 핸들러 배열 가져오기
  const handlers = elementEvents.get(eventType);
  console.log("handlers: ", handlers);

  // 핸들러 배열에서 특정 핸들러 찾기
  const index = handlers.indexOf(handler);

  // 핸들러를 찾았으면 제거
  if (index !== -1) {
    handlers.splice(index, 1);
  }

  //  후속 처리: 빈 배열이 되면 해당 항목 제거
  if (handlers.length === 0) {
    elementEvents.delete(eventType);
  }

  //  이벤트가 없으면 요소 자체를 맵에서 제거
  if (elementEvents.size === 0) {
    handlersMap.delete(element);
  }
}
