(() => {
  "use strict";

  /* Footer year */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Header scroll state */
  const header = document.getElementById("header");
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Mobile nav toggle */
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      menuToggle.classList.toggle("is-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
    nav.querySelectorAll(".nav__link").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        menuToggle.classList.remove("is-open");
      });
    });
  }

  /* Scroll reveal */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 4, 3) * 90}ms`;
      io.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* Before / After sliders */
  document.querySelectorAll("[data-ba-slider]").forEach((slider) => {
    const before = slider.querySelector("[data-ba-before]");
    const handle = slider.querySelector("[data-ba-handle]");
    const range = slider.querySelector("[data-ba-range]");

    const setPosition = (percent) => {
      const p = Math.max(0, Math.min(100, percent));
      before.style.clipPath = `inset(0 ${100 - p}% 0 0)`;
      handle.style.left = `${p}%`;
      range.value = p;
    };

    setPosition(50);

    range.addEventListener("input", () => setPosition(Number(range.value)));

    let dragging = false;
    const posFromClientX = (clientX) => {
      const rect = slider.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    };

    const startDrag = (clientX) => {
      dragging = true;
      setPosition(posFromClientX(clientX));
    };
    const moveDrag = (clientX) => {
      if (!dragging) return;
      setPosition(posFromClientX(clientX));
    };
    const endDrag = () => { dragging = false; };

    slider.addEventListener("pointerdown", (e) => startDrag(e.clientX));
    window.addEventListener("pointermove", (e) => moveDrag(e.clientX));
    window.addEventListener("pointerup", endDrag);
  });

  /* Case study detail modal */
  const modalOverlay = document.getElementById("modalOverlay");
  const modalBody = document.getElementById("modalBody");
  const modalClose = document.getElementById("modalClose");
  const detailStore = document.getElementById("caseDetailStore");

  if (modalOverlay && modalBody && modalClose && detailStore) {
    let activeDetail = null;

    const openDetail = (id) => {
      const node = document.getElementById(id);
      if (!node) return;
      activeDetail = node;
      modalBody.appendChild(node);
      modalOverlay.classList.add("is-open");
      modalOverlay.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    const closeDetail = () => {
      if (activeDetail) {
        detailStore.appendChild(activeDetail);
        activeDetail = null;
      }
      modalOverlay.classList.remove("is-open");
      modalOverlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    document.querySelectorAll("[data-detail-target]").forEach((trigger) => {
      trigger.addEventListener("click", () => openDetail(trigger.getAttribute("data-detail-target")));
    });
    modalClose.addEventListener("click", closeDetail);
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeDetail();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !(lightbox && lightbox.classList.contains("is-open"))) closeDetail();
    });
  }

  /* Image lightbox: click any secondary photo (work-process grids, fence design galleries) to enlarge it */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");

  if (lightbox && lightboxImg && lightboxClose) {
    const openLightbox = (src, alt) => {
      lightboxImg.src = src;
      lightboxImg.alt = alt || "";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
    };
    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      lightboxImg.src = "";
    };

    document.addEventListener("click", (e) => {
      const img = e.target.closest(".case-card__process-grid img");
      if (img) openLightbox(img.currentSrc || img.src, img.alt);
    });
    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
    });
  }
})();
