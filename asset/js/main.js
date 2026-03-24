/* =========================
   NAVBAR + TAB PAGE
========================= */
const navItems = document.querySelectorAll(".nav-item");
const navCircle = document.querySelector(".circle");
const tabPages = document.querySelectorAll(".tab-page");

function moveCircle(index) {
  const item = navItems[index];
  if (!item || !navCircle) return;

  const itemRect = item.getBoundingClientRect();
  const navRect = item.parentElement.getBoundingClientRect();
  const center = itemRect.left - navRect.left + itemRect.width / 2;

  navCircle.style.left = `${center - navCircle.offsetWidth / 2}px`;
}

function switchPage(index) {
  navItems.forEach((item) => item.classList.remove("active"));
  tabPages.forEach((page) => page.classList.remove("active"));

  const activeNav = document.querySelector(`.nav-item[data-index="${index}"]`);
  const activePage = document.querySelector(`.tab-page[data-index="${index}"]`);

  if (activeNav) activeNav.classList.add("active");
  if (activePage) activePage.classList.add("active");

  moveCircle(Number(index));
}

navItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    switchPage(item.dataset.index);
  });
});

window.addEventListener("load", () => moveCircle(0));
window.addEventListener("resize", () => {
  const activeNav = document.querySelector(".nav-item.active");
  if (activeNav) moveCircle(activeNav.dataset.index);
});


/* =========================
   BOOKING
========================= */
const pageSummary = document.getElementById("page_summary");
const pageBooking = document.getElementById("page_booking");

const monthTitle = document.getElementById("monthTitle");
const calGrid = document.getElementById("calGrid");
const summaryBox = document.getElementById("summarybox");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");
const btnAdd = document.getElementById("btnadd");

const btnBack = document.getElementById("btnBack");
const btnAccept = document.getElementById("btnAccept");
const pickedDateText = document.getElementById("pickedDateText");
const note = document.getElementById("bookingnote");

const monthTitle2 = document.getElementById("monthTitle2");
const calGrid2 = document.getElementById("calGrid2");
const prevMonth2 = document.getElementById("prevMonth2");
const nextMonth2 = document.getElementById("nextMonth2");

const sh = document.getElementById("sh");
const sm = document.getElementById("sm");
const eh = document.getElementById("eh");
const em = document.getElementById("em");

let current = new Date(2026, 0, 1);
let current2 = new Date(2026, 0, 1);
let selectDate = null;
let bookings = [];

function pad2(n) {
  return String(n).padStart(2, "0");
}

function dateKey(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function fillCalendarGrid(grid, currentDate, selectedDate, onSelect) {
  grid.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysPrevMonth = new Date(year, month, 0).getDate();

  for (let i = startWeekday - 1; i >= 0; i--) {
    const cell = document.createElement("div");
    cell.className = "day muted";
    cell.textContent = daysPrevMonth - i;
    grid.appendChild(cell);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement("div");
    cell.className = "day";
    cell.textContent = d;

    const key = dateKey(new Date(year, month, d));
    if (key === selectedDate) cell.classList.add("selected");

    cell.addEventListener("click", () => onSelect(key));
    grid.appendChild(cell);
  }

  const totalCells = grid.children.length;
  const remain = 42 - totalCells;
  for (let i = 1; i <= remain; i++) {
    const cell = document.createElement("div");
    cell.className = "day muted";
    cell.textContent = i;
    grid.appendChild(cell);
  }
}

function renderCalendar() {
  const monthName = current.toLocaleString("en-US", { month: "long" });
  monthTitle.textContent = `${monthName} ${current.getFullYear()}`;

  fillCalendarGrid(calGrid, current, selectDate, (key) => {
    selectDate = key;
    renderCalendar();
    renderSummary();
  });
}

function renderCalendar2() {
  const monthName = current2.toLocaleString("en-US", { month: "long" });
  monthTitle2.textContent = `${monthName} ${current2.getFullYear()}`;

  fillCalendarGrid(calGrid2, current2, selectDate, (key) => {
    selectDate = key;
    if (pickedDateText) pickedDateText.textContent = key;
    renderCalendar2();
  });
}

function renderSummary() {
  if (bookings.length === 0) {
    summaryBox.innerHTML = `<p class="muted">ยังไม่มีการนัดหมาย</p>`;
    return;
  }

  const sorted = [...bookings].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return (a.start || "").localeCompare(b.start || "");
  });

  const groups = {};
  for (const booking of sorted) {
    if (!groups[booking.date]) groups[booking.date] = [];
    groups[booking.date].push(booking);
  }

  summaryBox.innerHTML = Object.keys(groups)
    .map((date) => {
      const items = groups[date]
        .map((b) => `<div class="sum-item">• ${b.start}-${b.end} : ${b.note || "-"}</div>`)
        .join("");

      return `
        <div class="sum-day">
          <div class="sum-date">${date}</div>
          <div class="sum-list">${items}</div>
        </div>
      `;
    })
    .join("");
}

function getTime(hourEl, minuteEl) {
  return `${hourEl.textContent}:${minuteEl.textContent}`;
}

function toMin(time) {
  const [hh, mm] = time.split(":").map(Number);
  return hh * 60 + mm;
}

function changeVal(el, maxInclusive, step, dir) {
  let value = parseInt(el.textContent, 10);
  const range = maxInclusive + 1;

  value = (value + dir * step) % range;
  if (value < 0) value += range;
  if (step > 1) value = Math.round(value / step) * step;
  if (value > maxInclusive) value = 0;

  el.textContent = pad2(value);
}

prevMonth?.addEventListener("click", () => {
  current = new Date(current.getFullYear(), current.getMonth() - 1, 1);
  renderCalendar();
});

nextMonth?.addEventListener("click", () => {
  current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
  renderCalendar();
});

prevMonth2?.addEventListener("click", () => {
  current2 = new Date(current2.getFullYear(), current2.getMonth() - 1, 1);
  renderCalendar2();
});

nextMonth2?.addEventListener("click", () => {
  current2 = new Date(current2.getFullYear(), current2.getMonth() + 1, 1);
  renderCalendar2();
});

btnAdd?.addEventListener("click", () => {
  selectDate = null;
  current2 = new Date(current.getFullYear(), current.getMonth(), 1);
  if (pickedDateText) pickedDateText.textContent = "";

  renderCalendar2();

  pageSummary?.classList.add("hidden");
  pageBooking?.classList.remove("hidden");
});

btnBack?.addEventListener("click", () => {
  pageBooking?.classList.add("hidden");
  pageSummary?.classList.remove("hidden");
});

btnAccept?.addEventListener("click", () => {
  if (!selectDate) {
    alert("โปรดเลือกวันในปฏิทินก่อน");
    return;
  }

  const start = getTime(sh, sm);
  const end = getTime(eh, em);

  if (toMin(start) >= toMin(end)) {
    alert("เวลาเริ่มต้นต้องน้อยกว่าเวลาสิ้นสุด");
    return;
  }

  bookings.push({
    date: selectDate,
    start,
    end,
    note: note.value.trim(),
  });

  note.value = "";
  pageBooking?.classList.add("hidden");
  pageSummary?.classList.remove("hidden");

  renderCalendar();
  renderSummary();
});

document.querySelectorAll(".tbtn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const act = btn.dataset.act;
    const dir = act.endsWith("+") ? 1 : -1;
    const key = act.slice(0, 2);

    if (key === "sh") changeVal(sh, 23, 1, dir);
    if (key === "sm") changeVal(sm, 59, 5, dir);
    if (key === "eh") changeVal(eh, 23, 1, dir);
    if (key === "em") changeVal(em, 59, 5, dir);
  });
});


/* =========================
   TIMER
========================= */
let modes = [20, 5, 20];
let currentMode = 0;
let seconds = modes[currentMode] * 60;
let timer = null;
let running = false;

const display = document.getElementById("display");
const tabs = document.querySelectorAll(".tab");
const startBtn = document.getElementById("startBtn");

function updateDisplay() {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  display.innerText = `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function toggleTimer() {
  if (!running) {
    running = true;
    startBtn.innerText = "Pause";
    startBtn.classList.add("pause");

    timer = setInterval(() => {
      if (seconds > 0) {
        seconds--;
        updateDisplay();
      } else {
        clearInterval(timer);
        running = false;
        startBtn.innerText = "Start";
        startBtn.classList.remove("pause");
      }
    }, 1000);
  } else {
    clearInterval(timer);
    running = false;
    startBtn.innerText = "Start";
    startBtn.classList.remove("pause");
  }
}

function resetTimer() {
  clearInterval(timer);
  running = false;
  seconds = modes[currentMode] * 60;
  startBtn.innerText = "Start";
  startBtn.classList.remove("pause");
  updateDisplay();
}

function switchMode(index) {
  currentMode = index;
  tabs.forEach((tab) => tab.classList.remove("active"));
  tabs[index].classList.add("active");
  resetTimer();
}

function openSettings() {
  document.getElementById("timerView").style.display = "none";
  document.getElementById("settingsView").style.display = "block";
}

function closeSettings() {
  document.getElementById("settingsView").style.display = "none";
  document.getElementById("timerView").style.display = "block";
}

function setTime() {
  modes[0] = parseInt(document.getElementById("play1").value) || 0;
  modes[1] = parseInt(document.getElementById("breakTime").value) || 0;
  modes[2] = parseInt(document.getElementById("play2").value) || 0;

  switchMode(0);
  updateDisplay();
  closeSettings();
}


/* =========================
   RECOMMEND CARD
========================= */
const recommendSection = document.querySelector(".recommend");
const firstRecommend = document.querySelector(".recommend-box");

if (recommendSection && firstRecommend) {
  for (let i = 0; i < 3; i++) {
    const clone = firstRecommend.cloneNode(true);
    recommendSection.appendChild(clone);
  }
}

document.querySelectorAll(".recommend-box").forEach((card) => {
  const readBtn = card.querySelector(".readmore");
  const closeBtn = card.querySelector(".close-btn");
  const stars = card.querySelectorAll(".star");

  readBtn?.addEventListener("click", () => {
    card.classList.add("expanded");
  });

  closeBtn?.addEventListener("click", () => {
    card.classList.remove("expanded");
  });

  stars.forEach((star) => {
    star.addEventListener("click", () => {
      const rating = star.getAttribute("data-value");

      stars.forEach((s) => {
        s.classList.remove("active", "spin");

        if (Number(s.getAttribute("data-value")) <= Number(rating)) {
          s.classList.add("active", "spin");

          setTimeout(() => {
            s.classList.remove("spin");
          }, 500);
        }
      });
    });
  });
});


/* =========================
   INIT
========================= */
renderCalendar();
renderSummary();
updateDisplay();