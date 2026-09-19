// MATRIX RAIN EFFECT (optimized)
let canvas = document.getElementById("matrix");
let ctx = canvas ? canvas.getContext("2d") : null;
const letters = "01";
const fontSize = 14;
let columns = 0;
let drops = [];
let rafId = null;

// MATRIX SPEED: lower = slower. (Was effectively 60.)
const MATRIX_FPS = 14;
const MATRIX_FRAME_MS = 1000 / MATRIX_FPS;
let lastMatrixFrame = 0;

function initCanvas() {
    if (!canvas || !ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize) || 1;
    drops = new Array(columns).fill(1);
}

function drawMatrix() {
    if (!ctx) return;
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#9b1c1c";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }

        drops[i]++;
    }
}

function animate(now = 0) {
    rafId = requestAnimationFrame(animate);
    if (now - lastMatrixFrame < MATRIX_FRAME_MS) return;
    lastMatrixFrame = now;
    drawMatrix();
}

function startMatrix() {
    cancelAnimationFrame(rafId);
    initCanvas();
    animate();
}

// initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    canvas = document.getElementById("matrix");
    ctx = canvas ? canvas.getContext("2d") : null;
    if (canvas) canvas.setAttribute('aria-hidden', 'true');
    initCanvas();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) startMatrix();
});

// handle resize with debounce
let resizeTimeout = null;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        initCanvas();
    }, 150);
});

// FUNNY LOADING SCREEN
const loadingBar = document.getElementById("loadingBar");
const loadingText = document.getElementById("loadingText");

const messages = [
    "Calibrating vibes...",
    "Reversing the polarity...",
    "Downloading more RAM...",
    "Polishing pixels...",
    "Teaching AI manners...",
    "Summoning dark mode...",
    "Refactoring reality...",
    "Installing personality...",
    "Generating coolness...",
    "Definitely not hacking NASA..."
];

let progress = 0;
let tick = 0;

function showPage() {
    const loader = document.getElementById("loader");
    const page = document.querySelector(".page");
    if (page) page.classList.remove("hidden");
    if (loader) {
        loader.classList.add("fade-out");
        setTimeout(() => { loader.style.display = "none"; }, 300);
    }
    try { sessionStorage.setItem("ekSeen", "1"); } catch (e) {}
    startBinaryTransition();
    setTimeout(landOnHash, 0);   // runs once the rest of this file has loaded
}

if (document.documentElement.classList.contains("skip-loader")) {
    // Seen it already this session: go straight to the page
    showPage();
} else {
    // First visit: roughly 1.2s loading screen
    const loadingInterval = setInterval(() => {
        progress += 4 + Math.random() * 10;
        if (loadingBar) loadingBar.style.width = Math.min(progress, 100) + "%";

        // swap the message every 3rd tick so it's actually readable
        if (loadingText && tick % 3 === 0) {
            loadingText.innerText = messages[Math.floor(Math.random() * messages.length)];
        }
        tick++;

        if (progress >= 100) {
            clearInterval(loadingInterval);
            setTimeout(showPage, 150);
        }
    }, 90);
}

// BINARY TEXT DECODE (plays when each heading scrolls into view)
function scrambleText(text) {
    return text
        .split("")
        .map(char => (char === " " || char === "\n") ? char : (Math.random() > 0.5 ? "0" : "1"))
        .join("");
}

function decodeElement(element) {
    const finalText = element.dataset.final || "";
    let iteration = 0;

    const interval = setInterval(() => {
        element.innerText = finalText
            .split("")
            .map((char, index) => {
                if (index < iteration) return char;
                if (char === " " || char === "\n") return char;
                return Math.random() > 0.5 ? "0" : "1";
            })
            .join("");

        if (iteration >= finalText.length) {
            clearInterval(interval);
            element.innerText = finalText;
        }

        iteration += 0.5;
    }, 25);
}

function startBinaryTransition() {
    const elements = document.querySelectorAll("h1, h2, h3, .binary");
    if (!elements.length) return;

    // Respect users who ask for less motion, and browsers without IntersectionObserver
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) return;

    // Hide the real text behind binary until the element is actually seen
    elements.forEach(element => {
        element.dataset.final = element.innerText || "";
        element.innerText = scrambleText(element.dataset.final);
    });

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            obs.unobserve(entry.target); // decode once per element
            decodeElement(entry.target);
        });
    }, { threshold: 0.6 });

    elements.forEach(element => observer.observe(element));
}

// IMPROVED SLIDESHOW
// IMPROVED SLIDESHOW (guarded)
let current = 0;
let slidesWrapper = document.querySelector(".slides-wrapper");
let slides = document.querySelectorAll(".slide");
let autoSlideInterval = null;

function updateSlidePosition() {
    if (!slidesWrapper) return;
    slidesWrapper.style.transform = `translateX(-${current * 100}%)`;
}

function nextSlide() {
    if (!slides || slides.length === 0) return;
    current = (current + 1) % slides.length;
    updateSlidePosition();
}

function prevSlide() {
    if (!slides || slides.length === 0) return;
    current = (current - 1 + slides.length) % slides.length;
    updateSlidePosition();
}

function startAutoSlide() {
    if (!slides || slides.length <= 1) return;
    stopAutoSlide();
    autoSlideInterval = setInterval(nextSlide, 4000);
}

function stopAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    autoSlideInterval = null;
}

const slideshowEl = document.querySelector(".slideshow");
if (slideshowEl) {
    slideshowEl.addEventListener("mouseenter", stopAutoSlide);
    slideshowEl.addEventListener("mouseleave", startAutoSlide);
}

startAutoSlide();

/* PROJECT DROPDOWN */

const projectButtons = document.querySelectorAll(".project-toggle");

// Re-measure the open panel (needed when images finish loading or the window resizes)
function resizeOpenProject() {
    document.querySelectorAll(".project-content").forEach(el => {
        if (el.style.maxHeight) el.style.maxHeight = el.scrollHeight + "px";
    });
}

projectButtons.forEach(button => {
    button.setAttribute("aria-expanded", "false");

    button.addEventListener("click", () => {
        const content = button.nextElementSibling;
        if (!content) return;

        const wasOpen = !!content.style.maxHeight;

        // close everything, then reopen this one if it was closed
        document.querySelectorAll(".project-content").forEach(el => {
            el.style.maxHeight = null;
        });
        projectButtons.forEach(b => b.setAttribute("aria-expanded", "false"));

        if (!wasOpen) {
            content.style.maxHeight = content.scrollHeight + "px";
            button.setAttribute("aria-expanded", "true");
        }
    });
});

window.addEventListener("resize", resizeOpenProject);
document.querySelectorAll(".project-content img").forEach(img => {
    img.addEventListener("load", resizeOpenProject);
});

/* SCREENSHOT LIGHTBOX */

const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox ? lightbox.querySelector("img") : null;

function openLightbox(img) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = img.dataset.full || img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
}

document.querySelectorAll(".project-media img").forEach(img => {
    img.tabIndex = 0;
    img.addEventListener("click", () => openLightbox(img));
    img.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openLightbox(img);
        }
    });
});

if (lightbox) lightbox.addEventListener("click", closeLightbox);
document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeLightbox();
});


/* GAMEPLAY CLIP */

const heroClip = document.getElementById("heroClip");
const heroVideo = document.getElementById("heroVideo");

if (heroClip && heroVideo) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function revealClip() {
        heroClip.hidden = false;

        if (reduceMotion) {
            // no autoplay for people who asked for less motion; let them press play
            heroVideo.pause();
            heroVideo.controls = true;
            return;
        }

        heroVideo.play().catch(() => {});

        // save battery: only play while it's on screen
        if ("IntersectionObserver" in window) {
            new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) heroVideo.play().catch(() => {});
                    else heroVideo.pause();
                });
            }, { threshold: 0.25 }).observe(heroVideo);
        }
    }

    // Only show the box once the video file has actually loaded
    if (heroVideo.readyState >= 2) revealClip();
    else heroVideo.addEventListener("loadeddata", revealClip, { once: true });
}


/* WIP BUTTONS: make .wip elements genuinely disabled (CSS alone can't stop keyboard use) */

document.querySelectorAll(".wip").forEach(el => {
    el.setAttribute("aria-disabled", "true");

    if (el.tagName === "BUTTON") {
        el.disabled = true;
    } else {
        el.tabIndex = -1;
        el.addEventListener("click", e => e.preventDefault());
    }
});


/* BANNER VIDEO */

const banner = document.getElementById("banner");
const bannerVideo = document.getElementById("bannerVideo");

if (banner && bannerVideo) {
    const conn = navigator.connection;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (conn && conn.saveData) {
        // visitor has data saver on: don't download the video at all
        bannerVideo.remove();
    } else {
        function revealBanner() {
            banner.classList.add("has-video");

            if (reduceMotion) {
                bannerVideo.pause();   // leaves a still frame behind the logo
                return;
            }

            bannerVideo.play().catch(() => {});

            // save battery: only play while it's on screen
            if ("IntersectionObserver" in window) {
                new IntersectionObserver(entries => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) bannerVideo.play().catch(() => {});
                        else bannerVideo.pause();
                    });
                }).observe(banner);
            }
        }

        // Only show the banner once the video has actually loaded
        if (bannerVideo.readyState >= 2) revealBanner();
        else bannerVideo.addEventListener("loadeddata", revealBanner, { once: true });
    }
}


/* JUMP-TO-SECTION LINKS (slides, or any <a href="#some-id">) */

// Resolves once the page has stopped scrolling, so the highlight starts when the visitor has "landed"
function waitForScrollToSettle(callback) {
    const startTime = performance.now();
    let lastY = window.scrollY;
    let stillFrames = 0;

    function check(now) {
        stillFrames = Math.abs(window.scrollY - lastY) < 1 ? stillFrames + 1 : 0;
        lastY = window.scrollY;

        if (stillFrames >= 6 || now - startTime > 2000) callback();
        else requestAnimationFrame(check);
    }

    requestAnimationFrame(check);
}

let highlightTimeout = null;

function highlightSection(el) {
    document.querySelectorAll(".section-highlight").forEach(other => other.classList.remove("section-highlight"));
    clearTimeout(highlightTimeout);

    void el.offsetWidth;   // restarts the animation if the same section is clicked twice
    el.classList.add("section-highlight");
    highlightTimeout = setTimeout(() => el.classList.remove("section-highlight"), 3100);
}

document.addEventListener("click", e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    // links with data-project are handled by the project handler below
    if (link.dataset.project && document.getElementById(link.dataset.project)) return;

    const id = link.getAttribute("href").slice(1);
    if (!id) return;                                  // ignore placeholder href="#" links

    const target = document.getElementById(id);
    if (!target) return;                              // no such section: leave the link alone

    e.preventDefault();

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });

    waitForScrollToSettle(() => {
        highlightSection(target);
        target.setAttribute("tabindex", "-1");        // so keyboard and screen reader users land there too
        target.focus({ preventScroll: true });
    });
});

document.addEventListener("click", e => {
    const link = e.target.closest("a[data-project]");
    if (!link) return;
 
    const item = document.getElementById(link.dataset.project);
    if (!item) return;                                // no such project: the link's normal href is used
 
    e.preventDefault();
 
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior = reduceMotion ? "auto" : "smooth";
    const button = item.querySelector(".project-toggle");
 
    item.scrollIntoView({ behavior, block: "start" });
 
    waitForScrollToSettle(() => {
        highlightSection(item);
 
        if (button) {
            // "click" the project's own button so the normal dropdown behaviour runs.
            // Skipped if it's already open (a link shouldn't close it) or disabled (.wip).
            if (!button.disabled && button.getAttribute("aria-expanded") !== "true") {
                button.click();
            }
            button.focus({ preventScroll: true });
        }
 
        // once the dropdown has finished opening, make sure it's all in view
        setTimeout(() => item.scrollIntoView({ behavior, block: "nearest" }), 450);
    });
});


/* LANDING ON A #SECTION FROM ANOTHER PAGE
   e.g. a project page's Back button links to index.html#projects.
   The page sits hidden behind the loader when it opens, so the browser can't jump there itself. */

function landOnHash() {
    if (location.hash.length < 2) return;

    let target = null;
    try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch (e) {}
    if (!target) return;

    target.scrollIntoView({ block: "start" });
    waitForScrollToSettle(() => highlightSection(target));

    // a link to one project (e.g. index.html#project-wallace) also opens its dropdown
    if (target.classList.contains("project-item")) {
        const button = target.querySelector(".project-toggle");
        if (button && !button.disabled && button.getAttribute("aria-expanded") !== "true") {
            button.click();
        }
        setTimeout(() => target.scrollIntoView({ block: "nearest" }), 450);
    }
}