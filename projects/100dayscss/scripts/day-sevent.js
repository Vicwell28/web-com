let panel = document.getElementById("panel");
let menu = document.getElementById("menu");

document.getElementById("menu-icon").addEventListener("click", function () {
  this.classList.toggle("active");

  if (this.classList.contains("active")) {
    panel.style.transform = "translate(100px, 0)";
    menu.style.transform = "translate(-100px, 0)";
    panel.style.boxShadow = "-10px 0 20px rgba(255, 255, 255, 0.8)";
  } else {
    panel.style.transform = "none";
    menu.style.transform = "none";
    panel.style.boxShadow = "none";
  }
});
