const items = document.querySelectorAll(".nav-item");
const circle = document.querySelector(".circle");

function movecircle(index) {
  const item = items[index];
  const itemRect = item.getBoundingClientRect();
  const navRect = item.parentElement.getBoundingClientRect();

  const center = itemRect.left - navRect.left + itemRect.width / 2;

  circle.style.left = `${center - circle.offsetWidth / 2}px`;
}

items.forEach((item, index) => {
  item.addEventListener("click", () => {

    document.querySelector(".active").classList.remove("active");
    item.classList.add("active");

    movecircle(index);
  });
});

movecircle(0);


const pageSummary = document.getElementById("page_summary");
const pageBooking = document.getElementById("page_booking");
// constหน้าแรก
const monthTitle = document.getElementById("monthTitle")
const calGrid = document.getElementById("calGrid");
const summaryBox = document.getElementById("summarybox");

const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");
const btnAdd = document.getElementById("btnadd");

//const page 2
const btnBack = document.getElementById("btnBack");
const btnAccept = document.getElementById("btnAccept");

const pickedDateText = document.getElementById("pickedDateText");
// const bookingstartTime = document.getElementById("bookingstart");
// const bookingendTime = document.getElementById("bookingend");
const note = document.getElementById("bookingnote");

// หน้าbookingแรก
let current = new Date(2026, 0 , 1);
let selectDate = null; //เก็บวันที่เลือก
let booking = []; //เก็บbooking {date,start,end,note}

function pad2(n){
  return String(n).padStart(2, "0"); //ถ้าวันที่เป็ฯหลักเดียวจะเติท0
}
function dateKey(d){
  return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
}//เก็บปี-เดือน-วันที่

function renderCalendar(){
  calGrid.innerHTML = "";

  const year = current.getFullYear();
  const month = current.getMonth();

  //เดือน ปี
  const monthName = current.toLocaleString("en-US",{month:"long"});
  monthTitle.textContent =`${monthName} ${year}`;

  const first = new Date(year, month, 1); //วันแรกของเดือน
  const startWeekday = first.getDay();

  const daysInMonth = new Date(year, month+1, 0).getDate();

  const daysprevMonth = new Date(year, month,0).getDate(); //วันเดือนก่อน ที่จางๆ
  for(let i = startWeekday -1; i>=0;i--){
    const cell =document.createElement("div");
    cell.className = "day muted";
    cell.textContent = daysprevMonth - i;
    calGrid.appendChild(cell);
  }

  //วันเดือนนี้
  for(let d=1;d<=daysInMonth;d++){
    const cell = document.createElement("div");
    cell.className = "day";
    cell.textContent = d;

    const key = dateKey(new Date(year, month, d));

    if(key === selectDate){
      cell.classList.add("selected");
    }

    cell.addEventListener("click", () =>{
      selectDate = key;
      renderCalendar();
      renderSummary();
    });

    calGrid.appendChild(cell);
  }
}

function renderSummary(){

  if(booking.length === 0){
    summaryBox.innerHTML = `<p class="muted">ยังไม่มีการนัดหมาย</p>`;
    return;
  }

  const sorted= [...booking].sort((a,b) =>{
    if(a.date !== b.date) return a.date.localeCompare(b.date);
    return (a.start || "").localeCompare(b.start || "");
  });

  const groups ={};
  for(const b of sorted){
    if(!groups[b.date]) groups[b.date] = [];
    groups[b.date].push(b);
  }

  summaryBox.innerHTML = Object.keys(groups).map(date => {
    const itemHtml = groups[date].map(b=>
      `<div class="sum-item">• ${b.start}-${b.end} : ${b.note || "-"}</div>`
    ).join("");

    return `<div class="sum-day">
        <div class="sum-date">${date}</div>
        <div class="sum-list">${itemHtml}</div>
      </div>
      `;
  }).join("");
};

// เปลี่ยนเดือน (หน้าแรก)
prevMonth.addEventListener("click", () => {
  current = new Date(current.getFullYear(), current.getMonth() - 1, 1);
  renderCalendar();
});

nextMonth.addEventListener("click", () => {
  current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
  renderCalendar();
});

//ไปหน้าเพิ่มbooking
btnAdd.addEventListener("click",() => {
  selectDate = null; //ล้างค่าเมื่อเข้ามาใหม่

  current2 = new Date(current.getFullYear(), current.getMonth(), 1);
  renderCalendar2();

    if (pickedDateText) pickedDateText.textContent = "";//clear when not choosee

  pageSummary.classList.add("hidden");
  pageBooking.classList.remove("hidden");
});

//กลับหน้าแรก
btnBack.addEventListener("click", () => {
  pageBooking.classList.add("hidden");
  pageSummary.classList.remove("hidden");
})

btnAccept.addEventListener("click", ()=>{
  if(!selectDate){
    alert("โปรดเลือกวันในปฏิทินก่อน");
    return;
  }
  
  const start =getTime(sh, sm);
  const end = getTime(eh, em);

  if(toMin(start) >= toMin(end)){
    alert("เวลาเริ่มต้นต้องน้อยกว่าเวลาสิ้นสุด");
    return;
  }

  booking.push({
    date: selectDate, 
    start, 
    end, 
    note: note.value.trim()
  });

  note.value =""; //clearnote

  pageBooking.classList.add("hidden");
  pageSummary.classList.remove("hidden");

  renderCalendar();
  renderSummary();
});

const monthTitle2 = document.getElementById("monthTitle2");
const calGrid2 = document.getElementById("calGrid2");
const prevMonth2 = document.getElementById("prevMonth2");
const nextMonth2 = document.getElementById("nextMonth2");

const sh = document.getElementById("sh");
const sm = document.getElementById("sm");
const eh = document.getElementById("eh");
const em = document.getElementById("em");

let current2 = new Date(2026, 0, 1);

prevMonth2.addEventListener("click", () => {
  current2 = new Date(current2.getFullYear(), current2.getMonth() - 1, 1);
  renderCalendar2();
});

nextMonth2.addEventListener("click", () => {
  current2 = new Date(current2.getFullYear(), current2.getMonth() + 1, 1);
  renderCalendar2();
});

function renderCalendar2(){
  calGrid2.innerHTML = "";

  const year = current2.getFullYear();
  const month = current2.getMonth();

  const monthName = current2.toLocaleString("en-US",{month:"long"});
  monthTitle2.textContent = `${monthName} ${year}`;

  const first = new Date(year, month, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const daysPrev = new Date(year, month, 0).getDate();

  for(let i = startWeekday - 1; i >= 0; i--){
    const cell = document.createElement("div");
    cell.className = "day muted";
    cell.textContent = daysPrev - i;
    calGrid2.appendChild(cell);
  }

  for(let d=1; d<=daysInMonth; d++){
    const cell = document.createElement("div");
    cell.className = "day";
    cell.textContent = d;

    const key = dateKey(new Date(year, month, d));
    if(key === selectDate) cell.classList.add("selected");

    cell.addEventListener("click", () => {
      selectDate = key;
      pickedDateText.textContent = selectDate; // อัปเดตข้อความ
      renderCalendar2();
    });

    calGrid2.appendChild(cell);
  }
}

function changeVal(el, max, step, dir){
  let v = parseInt(el.textContent,10);
  v+= dir * step;
  if(v>max) v =0;
  if(v<0) v=max;
  el.textContent = pad2(v);
}

document.querySelectorAll(".tbtn").forEach(btn => {
  btn.addEventListener("click", () =>{
    console.log("clicked", btn, btn.dataset.act); // ✅ เพิ่มบรรทัดนี้
    const act = btn.dataset.act; //sh+ sm-
    const dir = act.endsWith("+") ? 1 : -1 ;
    const key = act.slice(0,2);

    if(key==="sh") changeVal(sh, 23, 1, dir);
    if(key==="sm") changeVal(sm, 55, 5, dir);
    if(key==="eh") changeVal(eh, 23, 1, dir);
    if(key==="em") changeVal(em, 55, 5, dir);
  });
});

function getTime(hE1,mE1){
  return `${hE1.textContent}:${mE1.textContent}`;
}

function toMin(t){
  const [hh,mm]=t.split(":").map(Number);
  return hh*60+mm;
}
//start
renderCalendar();
renderSummary();

