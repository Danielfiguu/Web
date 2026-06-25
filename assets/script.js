/* ============================================================
   Mocacán a Pedir de Boca — interactions
   ============================================================ */

(function () {
    "use strict";

    /* ---------- Language toggle (ES / EN) ---------- */
    const LANG_KEY = "mocacan-lang";
    const langButtons = document.querySelectorAll(".lang-btn");
    const langPill = document.getElementById("langPill");

    function applyLang(lang) {
        document.querySelectorAll("[data-" + lang + "]").forEach(function (el) {
            const val = el.getAttribute("data-" + lang);
            if (val !== null) el.textContent = val;
        });
        document.documentElement.lang = lang;

        langButtons.forEach(function (btn, i) {
            const active = btn.dataset.lang === lang;
            btn.classList.toggle("active", active);
            if (active && langPill) {
                langPill.style.transform = "translateX(" + (btn.offsetLeft - 4) + "px)";
                langPill.style.width = btn.offsetWidth + "px";
            }
        });
    }

    function setLang(lang, animate) {
        localStorage.setItem(LANG_KEY, lang);
        if (animate) {
            document.body.classList.add("lang-fading");
            setTimeout(function () {
                applyLang(lang);
                document.body.classList.remove("lang-fading");
            }, 220);
        } else {
            applyLang(lang);
        }
    }

    langButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            if (!btn.classList.contains("active")) setLang(btn.dataset.lang, true);
        });
    });

    const savedLang = localStorage.getItem(LANG_KEY) || "es";
    // run after layout so pill positions correctly
    window.addEventListener("load", function () { applyLang(savedLang); });
    applyLang(savedLang);

    /* ---------- Nav: scrolled state + progress ---------- */
    const nav = document.getElementById("nav");
    const progress = document.getElementById("scrollProgress");

    function onScroll() {
        const y = window.scrollY;
        nav.classList.toggle("scrolled", y > 40);
        const h = document.documentElement.scrollHeight - window.innerHeight;
        if (progress) progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---------- Mobile menu ---------- */
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");
    if (navToggle) {
        navToggle.addEventListener("click", function () {
            navToggle.classList.toggle("open");
            navLinks.classList.toggle("open");
        });
        navLinks.querySelectorAll("a").forEach(function (a) {
            a.addEventListener("click", function () {
                navToggle.classList.remove("open");
                navLinks.classList.remove("open");
            });
        });
    }

    /* ---------- Reveal on scroll ---------- */
    const reveals = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry, idx) {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const siblings = Array.prototype.slice.call(
                        el.parentNode.querySelectorAll(":scope > .reveal")
                    );
                    const pos = siblings.indexOf(el);
                    el.style.transitionDelay = (pos > 0 ? Math.min(pos, 6) * 0.07 : 0) + "s";
                    el.classList.add("in");
                    io.unobserve(el);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
        reveals.forEach(function (el) { io.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add("in"); });
    }

    /* ---------- Bento pointer glow ---------- */
    document.querySelectorAll(".tile").forEach(function (tile) {
        tile.addEventListener("pointermove", function (e) {
            const r = tile.getBoundingClientRect();
            tile.style.setProperty("--mx", (e.clientX - r.left) + "px");
            tile.style.setProperty("--my", (e.clientY - r.top) + "px");
        });
    });

    /* ---------- Lightbox ---------- */
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxClose = document.getElementById("lightboxClose");

    function openLightbox(src, alt) {
        lightboxImg.src = src;
        lightboxImg.alt = alt || "";
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }
    function closeLightbox() {
        lightbox.classList.remove("open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }
    document.querySelectorAll(".shot").forEach(function (shot) {
        shot.addEventListener("click", function () {
            const img = shot.querySelector("img");
            openLightbox(shot.dataset.full, img ? img.alt : "");
        });
    });
    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
    if (lightbox) lightbox.addEventListener("click", function (e) {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
    });

    /* ---------- Hero parallax on logo ---------- */
    const heroLogo = document.querySelector(".hero-logo");
    if (heroLogo && window.matchMedia("(pointer:fine)").matches) {
        window.addEventListener("scroll", function () {
            const y = Math.min(window.scrollY, 600);
            heroLogo.style.transform = "translateY(" + y * 0.12 + "px)";
        }, { passive: true });
    }
})();
