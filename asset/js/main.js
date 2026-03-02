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

// constหน้าแรก
const monthTitle = document.getElementById("monthTitle")
const calGrid = document.getElementById("calGrid");
const summaryBox = document.getElementById("summarybox");

const prevMonth = document.getAnimations("prevMonth");
const nextMonth = document.getElementById("nextMonth");
const btnAdd = document.getElementById("btnadd");

//const page 2
const btnBack = document.getElementById("btnBack");
const btnAccept = document.getElementById("btnAccept");

const pickedDateText = document.getElementById("pickedDateText");
const bookingstartTime = document.getElementById("bookingstart");
const bookingendTime = document.getElementById("bookingend");
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

