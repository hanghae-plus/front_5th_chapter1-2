import { test } from "@playwright/test";
import fs from "fs";
import path from "path";

const ELEMENTS_COUNT = 1000; // 생성할 요소 수
const CYCLES = 5; // 생성/제거 반복 횟수

const TEST_RESULT_BASE_FOLDER = "e2e-performance";
const getMemoryTestFilePath = () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const folderPath = path.resolve(process.cwd(), TEST_RESULT_BASE_FOLDER);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  return path.resolve(folderPath, `memory-test-${timestamp}.csv`);
};

// TODO: test util 함수로 분리
function saveTestResult(
  filePath,
  testName,
  cycle,
  initialMemory,
  currentMemory,
) {
  const testHeader =
    "Timestamp,TestName,Cycle,InitialMemory(MB),CurrentMemory(MB),MemoryDiff(MB)\n";
  const exists = fs.existsSync(filePath);

  if (!exists) fs.writeFileSync(filePath, testHeader);

  const memoryDiff = (currentMemory - initialMemory).toFixed(2);
  const row =
    [
      new Date().toISOString(),
      `"${testName}"`,
      cycle,
      initialMemory.toFixed(2),
      currentMemory.toFixed(2),
      memoryDiff,
    ].join(",") + "\n";

  fs.appendFileSync(filePath, row);
}

test.describe("EventManager 메모리 성능 테스트", () => {
  // 테스트 전 eventManager 코드 주입
  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    const eventManagerPath = path.join(
      process.cwd(),
      "src/lib/eventManager.js",
    );
    const eventManagerCode = fs.readFileSync(eventManagerPath, "utf8");

    await page.evaluate((code) => {
      window.testEventManager = {};

      const modifiedCode = code
        .replace(
          /export function ([a-zA-Z]+)/g,
          "window.testEventManager.$1 = function",
        )
        .replace(/export const ([a-zA-Z]+)/g, "window.testEventManager.$1 =");

      eval(modifiedCode);
    }, eventManagerCode);
  });

  test("대량의 DOM 요소 생성 및 제거 후 메모리 사용량 측정", async ({
    page,
  }) => {
    const resultFilePath = getMemoryTestFilePath();
    console.log(`메모리 테스트 결과 파일: ${resultFilePath}`);

    const initialMemory = await page.evaluate(() =>
      performance.memory
        ? performance.memory.usedJSHeapSize / (1024 * 1024)
        : 0,
    );

    console.log(`초기 메모리 사용량: ${initialMemory.toFixed(2)}MB`);

    for (let cycle = 0; cycle < CYCLES; cycle++) {
      // 1. 대량의 DOM 요소 생성 및 이벤트 리스너 추가
      await page.evaluate((count) => {
        const container = document.createElement("div");
        container.id = "test-container";
        document.body.appendChild(container);

        // 글로벌 eventManager를 사용하여 이벤트 리스너 설정
        window.testEventManager.setupEventListeners(document.body);

        // 요소 생성 및 이벤트 등록
        for (let i = 0; i < count; i++) {
          const element = document.createElement("button");
          element.textContent = `Button ${i}`;
          element.id = `btn-${i}`;
          container.appendChild(element);

          window.testEventManager.addEvent(element, "click", () =>
            console.log(`Click ${i}`),
          );
          window.testEventManager.addEvent(element, "mouseover", () =>
            console.log(`Mouseover ${i}`),
          );
          window.testEventManager.addEvent(element, "mouseout", () =>
            console.log(`Mouseout ${i}`),
          );
        }

        for (let i = 0; i < Math.min(50, count); i++) {
          const element = document.getElementById(`btn-${i}`);
          if (element) {
            const event = new MouseEvent("click", {
              bubbles: true,
              cancelable: true,
            });
            element.dispatchEvent(event);
          }
        }
        return count;
      }, ELEMENTS_COUNT);

      // 2. 메모리 상태 확인
      const midMemory = await page.evaluate(() => {
        return performance.memory
          ? performance.memory.usedJSHeapSize / (1024 * 1024)
          : 0;
      });

      saveTestResult(
        resultFilePath,
        "DOM 요소 생성 후",
        cycle + 1,
        initialMemory,
        midMemory,
      );

      console.log(
        `요소 생성 후 메모리 (사이클 ${cycle + 1}): ${midMemory.toFixed(2)}MB`,
      );

      // 3. 요소 제거
      await page.evaluate(() => {
        const container = document.getElementById("test-container");
        if (container) {
          document.body.removeChild(container);
        }
      });

      // 4. 가비지 컬렉션 유도 (브라우저에서 허용되는 경우)
      await page.evaluate(() => {
        if (window.gc) {
          window.gc();
        } else {
          const pressure = [];
          for (let i = 0; i < 1000000; i++) {
            pressure.push(new Array(100).fill(i));
            if (i % 10000 === 0) {
              pressure.length = 0;
            }
          }
        }
      });

      // GC 후 메모리 상태 확인
      const afterGcMemory = await page.evaluate(() => {
        return performance.memory
          ? performance.memory.usedJSHeapSize / (1024 * 1024)
          : 0;
      });

      saveTestResult(
        resultFilePath,
        "GC 실행 후",
        cycle + 1,
        initialMemory,
        afterGcMemory,
      );

      console.log(
        `GC 후 메모리 (사이클 ${cycle + 1}): ${afterGcMemory.toFixed(2)}MB`,
      );

      await page.waitForTimeout(500);
    }

    const finalMemory = await page.evaluate(() => {
      return performance.memory
        ? performance.memory.usedJSHeapSize / (1024 * 1024)
        : 0;
    });

    saveTestResult(
      resultFilePath,
      "테스트 완료",
      CYCLES,
      initialMemory,
      finalMemory,
    );

    console.log(`최종 메모리 사용량: ${finalMemory.toFixed(2)}MB`);
    console.log(`메모리 증가량: ${(finalMemory - initialMemory).toFixed(2)}MB`);
    console.log(`상세 결과는 ${resultFilePath} 파일에서 확인할 수 있습니다.`);
  });
});
