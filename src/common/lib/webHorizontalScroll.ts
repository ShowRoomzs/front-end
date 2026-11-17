/**
 * PC 마우스로 가로 스크롤 줄(필터 칩 · 함께 판매 중 · 사진 넘김 등)을 움직일 수 있게 한다 — 웹 전용(index.ts가 웹에서만 부른다).
 *
 * 앱의 가로 ScrollView는 손가락으로 미는 전제라, 웹 PC에서는 마우스로 움직일 방법이 없다
 * (트랙패드 · Shift+휠만 된다). 그래서 화면 밖으로 밀려난 칩 · 카드 · 둘째 사진에 닿을 수 없었다.
 *
 * - 끌기: 모든 가로 줄을 마우스로 잡아 끌 수 있다. 사진처럼 한 장씩 멈추는 줄은 놓으면 가까운 장으로 붙는다.
 * - 휠: 칩 · 카드 줄은 세로 휠을 가로로 옮긴다. **사진 넘김에는 쓰지 않는다** — 사진 위에서 화면을 내리려던
 *   휠이 사진을 넘겨 버리기 때문이다. 줄이 끝까지 가면 손대지 않아 화면 세로 스크롤로 넘어간다.
 */
function isHorizontalScroller(node: Element): node is HTMLElement {
  if (!(node instanceof HTMLElement) || node.scrollWidth <= node.clientWidth + 1) {
    return false;
  }
  const overflowX = getComputedStyle(node).overflowX;

  return overflowX === "auto" || overflowX === "scroll";
}

function isPaged(node: HTMLElement) {
  return getComputedStyle(node).scrollSnapType.includes("mandatory");
}

function closestHorizontalScroller(start: EventTarget | null) {
  let node = start instanceof Element ? start : null;

  while (node && node !== document.body) {
    if (isHorizontalScroller(node)) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

function handleWheel(event: WheelEvent) {
  // 트랙패드 가로 밀기 · Shift+휠 · 확대는 브라우저가 이미 처리한다
  if (event.ctrlKey || event.shiftKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) {
    return;
  }
  const scroller = closestHorizontalScroller(event.target);

  if (!scroller || isPaged(scroller)) {
    return;
  }
  const canGoForward = scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1;
  const canGoBack = scroller.scrollLeft > 0;

  if ((event.deltaY > 0 && canGoForward) || (event.deltaY < 0 && canGoBack)) {
    event.preventDefault();
    scroller.scrollLeft += event.deltaY;
  }
}

/** 이만큼 움직여야 끌기로 본다 — 그 전에 놓으면 그냥 누름(상품 열기 등)이다 */
const DRAG_THRESHOLD_PX = 5;

interface DragState {
  scroller: HTMLElement;
  startX: number;
  startLeft: number;
  isDragging: boolean;
}

let drag: DragState | null = null;

/** 끌기 전에 한 장씩 붙는 줄이었는지 — 끄는 동안 그 설정을 꺼 두므로 미리 적어 둔다 */
const pagedBeforeDrag = new WeakMap<HTMLElement, boolean>();

/** 부드러운 넘김(브라우저 기본 약 300ms)이 끝난 뒤 붙는 동작을 되돌린다 */
const SNAP_RESTORE_MS = 450;

function swallowNextClick(event: MouseEvent) {
  event.stopPropagation();
  event.preventDefault();
}

function handlePointerDown(event: PointerEvent) {
  if (event.pointerType !== "mouse" || event.button !== 0) {
    return;
  }
  const scroller = closestHorizontalScroller(event.target);

  drag = scroller
    ? { scroller, startX: event.clientX, startLeft: scroller.scrollLeft, isDragging: false }
    : null;
  // 끌기 시작이 글자 선택으로 번지지 않게 — 놓을 때 되돌린다
  scroller?.style.setProperty("user-select", "none");
}

function handlePointerMove(event: PointerEvent) {
  if (!drag) {
    return;
  }
  const dx = event.clientX - drag.startX;

  if (!drag.isDragging) {
    if (Math.abs(dx) < DRAG_THRESHOLD_PX) {
      return;
    }
    drag.isDragging = true;
    pagedBeforeDrag.set(drag.scroller, isPaged(drag.scroller));
    // 끄는 동안 한 장씩 붙는 동작을 끈다 — 켜 두면 손을 따라오지 않고 계속 제자리로 튄다
    drag.scroller.style.scrollSnapType = "none";
    drag.scroller.style.cursor = "grabbing";
  }
  event.preventDefault();
  drag.scroller.scrollLeft = drag.startLeft - dx;
}

function handlePointerUp(event: PointerEvent) {
  if (!drag) {
    return;
  }
  const { scroller, isDragging, startLeft } = drag;

  drag = null;
  scroller.style.removeProperty("user-select");
  if (!isDragging) {
    return;
  }
  scroller.style.cursor = "";
  // 끈 뒤 손을 떼면 click이 이어 온다 — 끌기를 상품 · 사진 누름으로 받지 않게 한 번 삼킨다
  window.addEventListener("click", swallowNextClick, { capture: true, once: true });
  setTimeout(() => window.removeEventListener("click", swallowNextClick, { capture: true }), 0);

  // 붙는 동작은 넘김이 끝난 뒤에 되돌린다 — 바로 켜면 브라우저가 가까운 장(대개 제자리)으로 먼저 붙여 버린다
  const restoreSnap = () => {
    scroller.style.scrollSnapType = "";
  };
  const wasPaged = pagedBeforeDrag.get(scroller) === true;

  pagedBeforeDrag.delete(scroller);
  if (wasPaged) {
    // 조금만 끌어도 넘어가게 — 놓은 방향으로 한 장(사진 앱의 넘김과 같다)
    const page = scroller.clientWidth;
    const startPage = Math.round(startLeft / page);
    const moved = scroller.scrollLeft - startLeft;
    const lastPage = Math.round((scroller.scrollWidth - page) / page);
    const target = Math.abs(moved) < page * 0.15 ? startPage : startPage + Math.sign(moved);

    scroller.scrollTo({ left: Math.min(Math.max(target, 0), lastPage) * page, behavior: "smooth" });
    setTimeout(restoreSnap, SNAP_RESTORE_MS);
  } else {
    restoreSnap();
  }
  event.preventDefault();
}

export function enableWebHorizontalScroll() {
  if (typeof document === "undefined") {
    return;
  }
  document.addEventListener("wheel", handleWheel, { passive: false });
  // 캡처 단계에서 받는다 — 사진의 두 번 탭(제스처 핸들러)이 누름 이벤트를 아래로 흘려보내지 않는다
  document.addEventListener("pointerdown", handlePointerDown, { capture: true });
  document.addEventListener("pointermove", handlePointerMove, { capture: true, passive: false });
  document.addEventListener("pointerup", handlePointerUp, { capture: true });
  document.addEventListener("pointercancel", handlePointerUp, { capture: true });
  // 끄는 중 사진을 끌어 옮기는 브라우저 기본 동작(고스트 이미지)을 막는다
  document.addEventListener("dragstart", event => {
    if (drag) {
      event.preventDefault();
    }
  });
}
