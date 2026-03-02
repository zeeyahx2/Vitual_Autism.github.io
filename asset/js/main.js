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