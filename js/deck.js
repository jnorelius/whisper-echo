const slides = [...document.querySelectorAll(".slide")];
const current = document.querySelector("[data-current]");
const total = document.querySelector("[data-total]");
let index = 0;

if (total) total.textContent = String(slides.length);

function show(next) {
  index = Math.max(0, Math.min(slides.length - 1, next));
  slides.forEach((slide, i) => {
    const on = i === index;
    slide.classList.toggle("active", on);
    slide.toggleAttribute("hidden", !on);
    slide.setAttribute("aria-hidden", String(!on));
  });
  if (current) current.textContent = String(index + 1);
  history.replaceState(null, "", `#${index + 1}`);
}

const fromHash = Number(location.hash.replace("#", ""));
show(fromHash >= 1 ? fromHash - 1 : 0);

document.querySelector("[data-prev]")?.addEventListener("click", () => show(index - 1));
document.querySelector("[data-next]")?.addEventListener("click", () => show(index + 1));
document.querySelector("[data-print]")?.addEventListener("click", () => window.print());

function setPrintLayout(on) {
  if (on) {
    slides.forEach((slide) => {
      slide.classList.add("active");
      slide.removeAttribute("hidden");
      slide.setAttribute("aria-hidden", "false");
    });
    return;
  }
  show(index);
}

window.addEventListener("beforeprint", () => setPrintLayout(true));
window.addEventListener("afterprint", () => setPrintLayout(false));
window.matchMedia?.("print").addEventListener("change", (event) => {
  setPrintLayout(event.matches);
});

window.addEventListener("keydown", (event) => {
  if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(event.key)) {
    event.preventDefault();
    show(index + 1);
  }
  if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) {
    event.preventDefault();
    show(index - 1);
  }
  if (event.key === "Home") show(0);
  if (event.key === "End") show(slides.length - 1);
});
