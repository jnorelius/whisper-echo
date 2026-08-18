document.querySelectorAll("[data-nav]").forEach((nav) => {
  const btn = nav.querySelector(".menu-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    });
  });
});

const landing = document.querySelector("[data-landing]");
const intro = document.querySelector("#intro");
const nav = document.querySelector("[data-nav]");
const video = document.querySelector("[data-landing-video]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setNavState() {
  if (!nav) return;
  const pastLanding = landing
    ? landing.getBoundingClientRect().bottom <= 72
    : window.scrollY > 40;
  nav.classList.toggle("is-solid", pastLanding);
}

setNavState();
window.addEventListener("scroll", setNavState, { passive: true });

if (reduceMotion && video) {
  video.removeAttribute("autoplay");
  video.pause();
}

if (landing && intro && !reduceMotion && window.scrollY < 40) {
  let cancelled = false;
  const cancel = () => {
    cancelled = true;
  };

  window.addEventListener("wheel", cancel, { passive: true, once: true });
  window.addEventListener("touchstart", cancel, { passive: true, once: true });
  window.addEventListener("keydown", cancel, { once: true });
  document.querySelector(".landing-skip")?.addEventListener("click", cancel);

  const dropToStory = () => {
    if (cancelled || window.scrollY > 40) return;
    intro.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (video) {
    video.addEventListener("ended", dropToStory);
    video.addEventListener("error", dropToStory);
  } else {
    window.setTimeout(dropToStory, 7800);
  }
}
