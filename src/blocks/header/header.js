import ready from "../../js/utils/documentReady.js";
import openNav from "../../js/common/openNav.js";

ready(function () {
  const pageHeader = document.querySelector(".header");
  if (pageHeader) {
    const menuTriggers = pageHeader.querySelectorAll("[data-menu-trigger]");
    const pageDarker = document.querySelector(".page__darker");
    menuTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        openNav();
      });
    });
    pageDarker.addEventListener("click", openNav);

    const headerLogo = pageHeader.querySelector(".header__logo");
    headerLogo.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (document.body.getAttribute("data-state") === "nav-open") openNav();
    });
  }
});
