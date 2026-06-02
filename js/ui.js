import { emit, EVENTS } from "./events.js";

export function initNavToggle() {
  const navbar = document.querySelector("#navbar");
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (!navbar || !toggle || !navLinks) return;

  // TODO: implement the hamburger toggle behavior (~8–10 lines)
  //
  // Toggle open/closed on button click
  toggle.addEventListener("click", () => {
    navbar.classList.toggle("nav-open");
    const isOpen = navbar.classList.contains("nav-open");
    toggle.setAttribute("aria-expanded", isOpen);
  });

  // Close the menu when any nav link is clicked (single-page navigation)
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => navbar.classList.remove("nav-open"));
  });
}

export function initUI() {
  const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length) {
    return;
  }

  const linkBySectionId = new Map(
    navLinks.map((link) => [link.getAttribute("href").slice(1), link])
  );

  const setActiveLink = (sectionId) => {
    navLinks.forEach((link) => link.removeAttribute("aria-current"));
    const activeLink = linkBySectionId.get(sectionId);
    if (activeLink) {
      activeLink.setAttribute("aria-current", "location");
      emit(EVENTS.NAV_SECTION_CHANGED, { sectionId });
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const topVisible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (topVisible?.target?.id) {
        setActiveLink(topVisible.target.id);
      }
    },
    {
      threshold: [0.35, 0.6],
      rootMargin: "-20% 0px -55% 0px",
    }
  );

  sections.forEach((section) => observer.observe(section));
}
