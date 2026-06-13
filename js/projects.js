import { emit, EVENTS } from "./events.js";

export function initProjects() {
  const projectTiles = [...document.querySelectorAll(".project-tile:not(.project-tile--next)")];
  const grid = document.querySelector(".projects-grid");
  const nextTile = document.querySelector(".project-tile--next");
  const filterButtons = [...document.querySelectorAll(".filter-btn")];
  const sortSelect = document.querySelector("#project-sort");
  const projectModal = document.querySelector("#project-modal");
  const modalClose = projectModal?.querySelector(".project-modal-close");
  const modalTitle = projectModal?.querySelector("#project-modal-title");
  const modalTech = projectModal?.querySelector("#project-modal-tech");
  const modalDesc = projectModal?.querySelector("#project-modal-desc");
  const modalSummary = projectModal?.querySelector("#project-modal-summary");
  const modalChallenge = projectModal?.querySelector("#project-modal-challenge");
  const modalLearned = projectModal?.querySelector("#project-modal-learned");
  const modalLink = projectModal?.querySelector("#project-modal-link");

  if (!projectTiles.length || !grid) {
    return;
  }

  const getProjectData = (tile) => ({
    tile,
    title: tile.querySelector("h3")?.textContent?.trim() ?? "Unknown Project",
    tech: tile.querySelector(".project-tech")?.textContent?.trim() ?? "",
    desc: tile.querySelector(".project-desc")?.textContent?.trim() ?? "",
    summary: tile.dataset.summary ?? "",
    challenge: tile.dataset.challenge ?? "",
    learned: tile.querySelector(".project-devlog")?.textContent?.replace(/^>_\s*/, "").trim() ?? "",
    categories: (tile.dataset.category ?? "")
      .split(" ")
      .map((item) => item.trim())
      .filter(Boolean),
    year: Number(tile.dataset.year ?? 0),
    url:
      tile.querySelector(".project-visit-btn")?.getAttribute("href") ??
      "#",
  });

  let activeFilter = "all";
  let lastFocusedTile = null; // for restoring focus after modal closes

  // WCAG #23 — focus trap helpers
  const FOCUSABLE = 'a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex="-1"])';

  const trapFocus = (e) => {
    if (!projectModal?.open) return;
    const focusable = [...projectModal.querySelectorAll(FOCUSABLE)];
    if (!focusable.length) return;
    const first = focusable[0];
    const last  = focusable.at(-1);
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  };

  // Inject count badges into each filter button
  const updateFilterCounts = () => {
    filterButtons.forEach(btn => {
      const filter = btn.dataset.filter ?? "all";
      const count = filter === "all"
        ? projectTiles.length
        : projectTiles.filter(t =>
            (t.dataset.category ?? "").split(" ").includes(filter)
          ).length;

      let countEl = btn.querySelector(".filter-count");
      if (!countEl) {
        countEl = document.createElement("span");
        countEl.className = "filter-count";
        countEl.setAttribute("aria-hidden", "true");
        btn.appendChild(countEl);
      }
      countEl.textContent = count;
    });
  };

  const filterStatus = document.getElementById("filter-status");

  const applyFilter = () => {
    projectTiles.forEach((tile) => {
      const categories = (tile.dataset.category ?? "").split(" ");
      const visible =
        activeFilter === "all" || categories.includes(activeFilter);
      tile.hidden = !visible;
    });

    // Announce result to screen readers (WCAG 4.1.3)
    if (filterStatus) {
      const visibleCount = projectTiles.filter(t => !t.hidden).length;
      filterStatus.textContent =
        `Showing ${visibleCount} of ${projectTiles.length} projects`;
    }

    emit(EVENTS.PROJECT_FILTER_CHANGED, { filter: activeFilter });
  };

  const applySort = () => {
    const sortBy = sortSelect?.value ?? "newest";
    const sorted = [...projectTiles].sort((a, b) => {
      const aName = a.querySelector("h3")?.textContent?.trim() ?? "";
      const bName = b.querySelector("h3")?.textContent?.trim() ?? "";
      const aYear = Number(a.dataset.year ?? 0);
      const bYear = Number(b.dataset.year ?? 0);

      if (sortBy === "name") {
        return aName.localeCompare(bName);
      }
      if (sortBy === "oldest") {
        return aYear - bYear || aName.localeCompare(bName);
      }
      return bYear - aYear || aName.localeCompare(bName);
    });

    sorted.forEach((tile) => grid.appendChild(tile));
    if (nextTile) grid.appendChild(nextTile);
    emit(EVENTS.PROJECT_SORT_CHANGED, { sortBy });
  };

  const openModal = (project) => {
    if (!projectModal || !modalTitle || !modalTech || !modalDesc || !modalSummary || !modalLink) {
      return;
    }

    modalTitle.textContent = project.title;
    modalTech.textContent = project.tech;
    modalDesc.textContent = project.desc;
    modalSummary.textContent = project.summary;
    if (modalChallenge) modalChallenge.textContent = project.challenge;
    if (modalLearned) modalLearned.textContent = project.learned;
    modalLink.href = project.url;

    if (typeof projectModal.showModal === "function") {
      projectModal.showModal();
    } else {
      projectModal.setAttribute("open", "true");
    }

    // Focus close button, activate focus trap (WCAG #23)
    modalClose?.focus();
    document.addEventListener('keydown', trapFocus);

    emit(EVENTS.PROJECT_MODAL_OPENED, { projectName: project.title, href: project.url });
  };

  const closeModal = () => {
    if (!projectModal?.open) {
      return;
    }

    if (typeof projectModal.close === "function") {
      projectModal.close();
    } else {
      projectModal.removeAttribute("open");
    }

    // Remove focus trap, restore focus to the tile that opened the modal (WCAG #23)
    document.removeEventListener('keydown', trapFocus);
    lastFocusedTile?.focus();

    emit(EVENTS.PROJECT_MODAL_CLOSED, {});
  };

  // Set initial aria-pressed state
  filterButtons.forEach((btn) =>
    btn.setAttribute("aria-pressed", btn.classList.contains("is-active") ? "true" : "false")
  );

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter ?? "all";
      filterButtons.forEach((item) => {
        item.classList.remove("is-active");
        item.setAttribute("aria-pressed", "false");
      });
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
      applyFilter();
    });
  });

  sortSelect?.addEventListener("change", applySort);

  modalClose?.addEventListener("click", closeModal);
  projectModal?.addEventListener("cancel", () => {
    emit(EVENTS.PROJECT_MODAL_CLOSED, {});
  });
  projectModal?.addEventListener("click", (event) => {
    const rect = projectModal.getBoundingClientRect();
    const clickedOutside =
      event.clientY < rect.top ||
      event.clientY > rect.bottom ||
      event.clientX < rect.left ||
      event.clientX > rect.right;

    if (clickedOutside) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && projectModal?.open) {
      closeModal();
    }
  });

  projectTiles.forEach((tile) => {
    const project = getProjectData(tile);
    tile.addEventListener("focusin", () => {
      emit(EVENTS.PROJECT_FOCUSED, { projectName: project.title, href: project.url });
    });

    tile.querySelector(".project-visit-btn")?.addEventListener("click", () => {
      emit(EVENTS.PROJECT_OPENED, { projectName: project.title, href: project.url });
    });

    tile.querySelector(".project-inspect-btn")?.addEventListener("click", (e) => {
      lastFocusedTile = e.currentTarget;
      openModal(project);
    });

    const shareBtn = tile.querySelector(".project-share-btn");
    const shareLabel = shareBtn?.querySelector(".project-share-btn__text");
    shareBtn?.addEventListener("click", async () => {
      const url = `${location.origin}${location.pathname}#${tile.id}`;
      try {
        await navigator.clipboard.writeText(url);
        if (shareLabel) shareLabel.textContent = "Copied!";
        shareBtn.classList.add("project-share-btn--copied");
        setTimeout(() => {
          if (shareLabel) shareLabel.textContent = "Share";
          shareBtn.classList.remove("project-share-btn--copied");
        }, 2000);
      } catch {
        // Clipboard API blocked — silently ignore
      }
    });
  });

  updateFilterCounts();
  applySort();
  applyFilter();
}
