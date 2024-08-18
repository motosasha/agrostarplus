import ready from "../../js/utils/documentReady.js";
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";

ready(function () {
  const productsSection = document.querySelector(".products");

  if (productsSection) {
    new Swiper(".products__slider", {
      modules: [Navigation, Pagination],
      navigation: {
        nextEl: ".products__next",
        prevEl: ".products__prev",
      },
      pagination: {
        el: ".swiper-pagination",
      },
      slidesPerView: "auto",
      spaceBetween: 16,
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
      },
    });
  }
});
