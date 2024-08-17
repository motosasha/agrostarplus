import ready from "../../js/utils/documentReady";
import HystModal from "./hystmodal";

ready(function () {
  const modal = new HystModal({
    linkAttributeName: "data-hystmodal",
  });

  window.thanks = function () {
    modal.open("#popup-thanks");
  };
});
