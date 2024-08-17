import ready from "../js/utils/documentReady.js";
import getScrollSize from "../js/utils/getScrollSize.js";

ready(function () {
  document.documentElement.style.setProperty("--css-scroll-size", `${getScrollSize()}px`);
});
