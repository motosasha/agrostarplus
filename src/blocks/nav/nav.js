import ready from "../../js/utils/documentReady.js";
import openNav from "../../js/common/openNav.js";

ready(function () {
  const pageNav = document.querySelector(".nav");
  if (pageNav) {
    const menuTriggers = pageNav.querySelectorAll("[data-menu-trigger]");
    menuTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        openNav();
      });
    });
  }
});
