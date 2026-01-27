// =========================
// NEWS PAGE INTERACTIONS
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".category-card");
  const cards = document.querySelectorAll(".news-card");
  const latestArticle = document.querySelector(".news-article");

  const copyBtn = document.getElementById("copyLinkBtn");
  const form = document.getElementById("newsletterForm");
  const msg = document.getElementById("newsletterMsg");

  function setActive(btn) {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  }

  function applyFilter(category) {
    cards.forEach(card => {
      const ok =
  category === "all" ||
  (card.dataset.category || "").split(" ").includes(category);

      card.style.display = ok ? "block" : "none";
    });

    if (latestArticle) {
      const latestCat = latestArticle.dataset.category;
      const showLatest =
  category === "all" ||
  (latestCat || "").split(" ").includes(category);
      latestArticle.style.opacity = showLatest ? "1" : "0.55";
    }
  }

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.filter;
      setActive(btn);
      applyFilter(category);
    });
  });

  // Copy article link
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        const url = window.location.href.split("#")[0] + "#latest";
        await navigator.clipboard.writeText(url);

        copyBtn.textContent = "Link copied ✓";
        setTimeout(() => (copyBtn.textContent = "Copy article link"), 1600);
      } catch (err) {
        copyBtn.textContent = "Copy failed";
        setTimeout(() => (copyBtn.textContent = "Copy article link"), 1600);
      }
    });
  }

  // Newsletter demo (front-end only)
  if (form && msg) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      msg.textContent = "Thanks! You’re subscribed (demo).";
      form.reset();
    });
  }

  // Default filter
  applyFilter("all");
});
