/* ── 코드 블록 복사 ─────────────────────────────────── */
document.querySelectorAll(".copy-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const pre = document.getElementById(btn.dataset.copy);
    if (!pre) return;
    const text = pre.innerText;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    const label = btn.textContent;
    btn.textContent = "복사됨";
    btn.classList.add("done");
    setTimeout(() => {
      btn.textContent = label;
      btn.classList.remove("done");
    }, 1400);
  });
});

/* ── 목차 현재 위치 표시 ────────────────────────────── */
const tocLinks = [...document.querySelectorAll(".toc a")];
const targets = tocLinks
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

if (targets.length) {
  const setActive = (id) => {
    tocLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
    const active = document.querySelector(".toc a.active");
    if (active && window.matchMedia("(max-width: 900px)").matches) {
      active.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    }
  };

  const seen = new Map();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => seen.set(e.target.id, e.intersectionRatio > 0 && e.boundingClientRect.top < window.innerHeight * 0.4));
      const current = targets.find((t) => seen.get(t.id));
      if (current) setActive(current.id);
    },
    { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
  );
  targets.forEach((t) => io.observe(t));
}

/* ── 목차 접기 ──────────────────────────────────────── */
const layoutEl = document.querySelector(".layout");
const tocToggle = document.getElementById("tocToggle");
if (layoutEl && tocToggle) {
  document.querySelectorAll(".toc a").forEach((a) => {
    const label = a.querySelector(".toc-label");
    if (label) a.title = label.textContent;
  });
  const apply = (collapsed) => {
    layoutEl.classList.toggle("toc-collapsed", collapsed);
    tocToggle.textContent = collapsed ? "펼치기" : "접기";
    tocToggle.setAttribute("aria-expanded", String(!collapsed));
    tocToggle.setAttribute("aria-label", collapsed ? "목차 펼치기" : "목차 접기");
    try { localStorage.setItem("toc-collapsed", collapsed ? "1" : "0"); } catch {}
  };
  let initialCollapsed = false;
  try { initialCollapsed = localStorage.getItem("toc-collapsed") === "1"; } catch {}
  if (initialCollapsed) apply(true);
  tocToggle.addEventListener("click", () => apply(!layoutEl.classList.contains("toc-collapsed")));
}
