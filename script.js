const header = document.querySelector(".site-header");
const nav = document.getElementById("nav");
const toggle = document.getElementById("menuToggle");
const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Close nav on link click (mobile)
nav?.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    if (window.innerWidth <= 880) {
      nav.classList.remove("open");
      toggle?.setAttribute("aria-expanded", "false");
    }
  })
);

// Header shadow on scroll
let lastY = 0;
const onScroll = () => {
  const y = window.scrollY || window.pageYOffset;
  const scrolled = y > 8;
  header.style.boxShadow = scrolled ? "0 6px 20px rgba(0,0,0,.18)" : "none";
  header.style.borderBottomColor = scrolled
    ? "color-mix(in oklab, var(--border), transparent 10%)"
    : "";
  lastY = y;
};
window.addEventListener("scroll", onScroll, { passive: true });

// Smooth scrolling for in-page anchors
const prefersReduced = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
if (!prefersReduced) {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id && id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          history.pushState(null, "", id);
        }
      }
    });
  });
}
