document.querySelectorAll(".menu-icon").forEach(function (menuIcon) {
  menuIcon.addEventListener("click", function () {
    menuIcon.classList.toggle("active");
    menuIcon.querySelectorAll("div").forEach(function (div) {
      div.classList.remove("no-animation");
    });
  });
});
