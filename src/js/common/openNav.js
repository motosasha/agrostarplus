export default function openNav() {
  let bodyState = document.body.getAttribute("data-state");
  bodyState === "nav-open" ? (document.body.dataset.state = "") : (document.body.dataset.state = "nav-open");
}
