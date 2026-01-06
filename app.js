
(() => {
  const ROUTES = {
    home: "index.html",
    products: "solutions.html",
    simulator: "simulator.html",
    usecases: "use-cases-2.html",
    demo: "demo.html",
    team: "team.html",
    careers: "careers.html",
    blog: "blog.html",
    contact: "contact.html",
  };

  const MENU_ITEMS = [
    { label: "Home", href: ROUTES.home },
    { label: "Products & Solutions", href: ROUTES.products },
    { label: "Simulator", href: ROUTES.simulator },
    { label: "Use Cases", href: ROUTES.usecases },
    { label: "Request a Demo", href: ROUTES.demo },
    { label: "Team & Partners", href: ROUTES.team },
    { label: "Careers", href: ROUTES.careers },
    { label: "News & Blog", href: ROUTES.blog },
    { label: "Contact", href: ROUTES.contact },
  ];

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === "class") node.className = v;
      else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    });
    children.forEach((c) => node.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
    return node;
  }

  function ensureDrawer() {
    if (document.getElementById("zflowDrawer")) return;

    const backdrop = el("div", {
      id: "zflowDrawerBackdrop",
      class:
        "fixed inset-0 z-50 hidden bg-black/60 backdrop-blur-sm",
      role: "presentation",
    });

    const panel = el("div", {
      id: "zflowDrawer",
      class:
        "fixed right-0 top-0 z-50 hidden h-full w-[85%] max-w-[360px] bg-[#0b0b11] text-white shadow-2xl border-l border-white/10",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Site navigation",
    });

    const header = el("div", { class: "flex items-center justify-between px-5 py-4 border-b border-white/10" }, [
      el("div", { class: "font-bold tracking-wide" }, ["ZFLOW.AI"]),
      el(
        "button",
        {
          type: "button",
          class:
            "rounded-xl px-3 py-2 text-sm font-semibold bg-white/10 hover:bg-white/15 transition",
          onclick: () => closeDrawer(),
        },
        ["Close"]
      ),
    ]);

    const list = el("div", { class: "px-3 py-3" });
    MENU_ITEMS.forEach((it) => {
      const a = el(
        "a",
        {
          href: it.href,
          class:
            "block rounded-2xl px-4 py-3 text-base font-semibold hover:bg-white/10 transition",
        },
        [it.label]
      );
      list.appendChild(a);
    });

    const footer = el("div", { class: "mt-auto px-5 py-4 border-t border-white/10 text-xs text-zinc-400" }, [
      "© ",
      new Date().getFullYear().toString(),
      " ZFLOW.AI",
    ]);

    panel.appendChild(header);
    panel.appendChild(list);
    panel.appendChild(footer);

    document.body.appendChild(backdrop);
    document.body.appendChild(panel);

    backdrop.addEventListener("click", closeDrawer);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDrawer();
    });
  }

  function openDrawer() {
    ensureDrawer();
    document.getElementById("zflowDrawerBackdrop").classList.remove("hidden");
    document.getElementById("zflowDrawer").classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    const b = document.getElementById("zflowDrawerBackdrop");
    const p = document.getElementById("zflowDrawer");
    if (b) b.classList.add("hidden");
    if (p) p.classList.add("hidden");
    document.body.style.overflow = "";
  }

  function wireMenuButton() {
    // Stitch exports sometimes wrap the menu icon in a <button>, but often it's just a <div>.
    // We'll attach the click handler to the closest reasonable wrapper (button/div/icon).
    const icon = Array.from(
      document.querySelectorAll(
        "span.material-symbols-outlined, span.material-icons, span.material-icons-outlined"
      )
    ).find((s) => (s.textContent || "").trim().toLowerCase() === "menu");

    // Also support SVG/icon buttons with aria-label
    const ariaBtn =
      document.querySelector('button[aria-label="menu"], [role="button"][aria-label="menu"]') ||
      null;

    const target =
      (icon && (icon.closest("button") || icon.closest("a") || icon.closest('[role="button"]') || icon.parentElement)) ||
      ariaBtn;

    if (!target) return;

    const tag = (target.tagName || "").toLowerCase();
    if (tag !== "button" && tag !== "a") {
      target.setAttribute("role", "button");
      target.setAttribute("tabindex", "0");
      target.classList.add("cursor-pointer");
    }

    const open = (e) => {
      e?.preventDefault?.();
      openDrawer();
    };

    target.addEventListener("click", open);
    target.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") open(e);
    });
  }

  function wireCTAs() {
    const allButtons = Array.from(document.querySelectorAll("button"));
    for (const b of allButtons) {
      // Explicit navigation override
      const direct = b.getAttribute("data-zflow-nav");
      if (direct) {
        b.classList.add("cursor-pointer");
        if (!b.__zflowNavWired) {
          b.__zflowNavWired = true;
          b.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = direct;
          });
        }
        continue;
      }

      const t = (b.textContent || "").trim().toLowerCase();

      // Avoid hijacking icon-only controls (menu, arrows, etc.)
      if (!t || t.length < 3) continue;

      // Map common CTAs to real pages
      if (
        t.includes("explore products") ||
        t.includes("products & solutions") ||
        t.includes("product") && t.includes("solution")
      ) {
        b.addEventListener("click", () => (window.location.href = ROUTES.products));
      } else if (t.includes("explore offerings") || t.includes("offerings") || t.includes("learn more")) {
        b.addEventListener("click", () => (window.location.href = ROUTES.products));
      } else if (t.includes("request a demo") || t.includes("book a demo") || t.includes("get a demo")) {
        b.addEventListener("click", () => (window.location.href = ROUTES.demo));
      } else if (t.includes("simulator")) {
        b.addEventListener("click", () => (window.location.href = ROUTES.simulator));
      } else if (t.includes("use case") || t.includes("application")) {
        b.addEventListener("click", () => (window.location.href = ROUTES.usecases));
      } else if (t.includes("team") || t.includes("partner")) {
        b.addEventListener("click", () => (window.location.href = ROUTES.team));
      } else if (t.includes("career") || t.includes("join")) {
        b.addEventListener("click", () => (window.location.href = ROUTES.careers));
      } else if (t.includes("news") || t.includes("blog")) {
        b.addEventListener("click", () => (window.location.href = ROUTES.blog));
      } else if (t.includes("contact")) {
        b.addEventListener("click", () => (window.location.href = ROUTES.contact));
      }
    }

    // Convert anchor placeholders
    document.querySelectorAll("a[href='#']").forEach((a) => {
      const t = (a.textContent || "").trim().toLowerCase();
      if (t.includes("contact")) a.setAttribute("href", ROUTES.contact);
    });
  }

  function toast(message, type = "success") {
    const id = "zflowToast";
    const old = document.getElementById(id);
    if (old) old.remove();

    const node = el("div", {
      id,
      class:
        "fixed bottom-4 left-1/2 z-[60] w-[92%] max-w-[480px] -translate-x-1/2 rounded-2xl border border-white/10 bg-[#0b0b11] px-4 py-3 text-sm shadow-2xl",
    });

    const row = el("div", { class: "flex items-start gap-3" });
    const dot = el("div", {
      class:
        "mt-1 h-2 w-2 shrink-0 rounded-full " +
        (type === "success" ? "bg-emerald-400" : "bg-red-400"),
    });
    const txt = el("div", { class: "text-white" }, [message]);
    const close = el(
      "button",
      { class: "ml-auto rounded-xl bg-white/10 px-3 py-1 text-xs font-semibold hover:bg-white/15 transition", type: "button" },
      ["OK"]
    );
    close.addEventListener("click", () => node.remove());

    row.appendChild(dot);
    row.appendChild(txt);
    row.appendChild(close);
    node.appendChild(row);

    document.body.appendChild(node);
    setTimeout(() => node.remove(), 4500);
  }

  function wireForms() {
    const forms = [
      {
        id: "contactForm",
        success: "Thanks — we received your message. We'll get back to you soon.",
      },
      {
        id: "demoForm",
        success: "Request received — we'll reach out shortly to schedule your demo.",
      },
    ];

    for (const cfg of forms) {
      const form = document.getElementById(cfg.id);
      if (!form) continue;

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const required = Array.from(form.querySelectorAll("[required]"));
        const missing = required.find((el) => !String(el.value || "").trim());
        if (missing) {
          missing.focus();
          toast("Please fill out all required fields.", "error");
          return;
        }
        toast(cfg.success, "success");
        form.reset();
      });
    }
  }

  function setActiveLink() {
    const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    // If drawer already exists, highlight the active link.
    const drawer = document.getElementById("zflowDrawer");
    if (!drawer) return;
    drawer.querySelectorAll("a").forEach((a) => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      if (href === path) a.classList.add("bg-white/10");
    });
  }

  
function wireBackButtons() {
  const BACK_ICONS = new Set([
    "arrow_back",
    "arrow_back_ios",
    "arrow_back_ios_new",
    "arrow_back_2",
    "keyboard_backspace",
    "west",
  ]);

  const spans = Array.from(
    document.querySelectorAll(
      "span.material-symbols-outlined, span.material-icons, span.material-icons-outlined"
    )
  );

  for (const s of spans) {
    const name = (s.textContent || "").trim().toLowerCase();
    if (!BACK_ICONS.has(name)) continue;

    // Prefer an actual button/link wrapper if it exists
    let target =
      s.closest("a") ||
      s.closest("button") ||
      s.closest('[role="button"]') ||
      s.parentElement;

    if (!target) continue;

    // Make non-interactive wrappers clickable/accessibile
    const tag = (target.tagName || "").toLowerCase();
    if (tag !== "a" && tag !== "button") {
      target.setAttribute("role", "button");
      target.setAttribute("tabindex", "0");
      target.classList.add("cursor-pointer");
    }

    const goBack = (e) => {
      e?.preventDefault?.();
      // If we have browser history, use it; otherwise fall back to Home.
      if (window.history && window.history.length > 1) window.history.back();
      else window.location.href = ROUTES.home;
    };

    // Avoid double-binding
    if (target.__zflowBackWired) continue;
    target.__zflowBackWired = true;

    target.addEventListener("click", goBack);
    target.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") goBack(e);
    });
  }
}


  function wireUseCaseFilters() {
    const chips = Array.from(document.querySelectorAll("[data-zflow-chip]"));
    const cases = Array.from(document.querySelectorAll("[data-zflow-case]"));
    if (!chips.length || !cases.length) return;

    function setActive(key) {
      chips.forEach((c) => {
        const isOn = c.getAttribute("data-zflow-chip") === key;
        c.classList.toggle("bg-primary/20", isOn);
        c.classList.toggle("text-primary", isOn);
        c.classList.toggle("bg-surface-dark/40", !isOn);
        c.classList.toggle("text-text-light", !isOn);
      });

      cases.forEach((sec) => {
        const k = sec.getAttribute("data-zflow-case");
        const show = (k === key);
        sec.classList.toggle("hidden", !show);
      });
    }

    chips.forEach((chip) => {
      chip.addEventListener("click", (e) => {
        e.preventDefault();
        setActive(chip.getAttribute("data-zflow-chip"));
      });
    });

    // default
    setActive(chips[0].getAttribute("data-zflow-chip"));
  }

  function wireTeamPartners() {
    // Modal for team member cards (leadership)
    const cards = Array.from(document.querySelectorAll("main [class*='rounded'], main [class*='rounded-lg']"))
      .filter((el) => el.querySelector("img") && el.querySelector("p") && el.querySelector("span.material-symbols-outlined"));

    if (!cards.length) return;

    const modal = document.createElement("div");
    modal.id = "zflowProfileModal";
    modal.className = "fixed inset-0 z-50 hidden";
    modal.innerHTML = `
      <div class="absolute inset-0 bg-black/60" data-close="1"></div>
      <div class="absolute left-1/2 top-1/2 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-surface-dark p-5 text-white shadow-xl">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p id="zflowProfileName" class="text-xl font-bold leading-tight"></p>
            <p id="zflowProfileRole" class="text-primary text-sm font-medium mt-1"></p>
          </div>
          <button class="rounded-lg p-2 hover:bg-white/10" data-close="1" aria-label="Close">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <p id="zflowProfileBio" class="text-text-secondary-dark text-base mt-4 leading-normal"></p>
      </div>
    `;
    document.body.appendChild(modal);

    function openProfile({ name, role, bio }) {
      modal.querySelector("#zflowProfileName").textContent = name || "Team Member";
      modal.querySelector("#zflowProfileRole").textContent = role || "";
      modal.querySelector("#zflowProfileBio").textContent = bio || "";
      modal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }
    function closeProfile() {
      modal.classList.add("hidden");
      document.body.style.overflow = "";
    }
    modal.addEventListener("click", (e) => {
      if (e.target && e.target.getAttribute && e.target.getAttribute("data-close")) closeProfile();
    });
    document.addEventListener("keydown", (e) => {
      if (!modal.classList.contains("hidden") && e.key === "Escape") closeProfile();
    });

    cards.forEach((card) => {
      // avoid wiring partner logo tiles etc: require a name-like bold text
      const nameEl = card.querySelector("p.text-lg, p.text-xl, p.font-bold, h3");
      const roleEl = card.querySelector("p.text-primary, p.text-blue-400, p.text-blue-500");
      const bioEl = card.querySelector("p.text-text-light, p.text-text-secondary-dark, p.text-zinc-400");

      const name = nameEl ? nameEl.textContent.trim() : "";
      if (!name) return;

      const role = roleEl ? roleEl.textContent.trim() : "";
      const bio = bioEl ? bioEl.textContent.trim() : "";

      card.classList.add("cursor-pointer");
      if (card.__zflowProfileWired) return;
      card.__zflowProfileWired = true;
      card.addEventListener("click", () => openProfile({ name, role, bio }));
    });

    // Partner logo carousel: auto-scroll any horizontal logo row
    const logoRow =
      document.querySelector("[data-zflow-partners]") ||
      document.querySelector("main .overflow-x-auto") ||
      null;
    if (logoRow && !logoRow.__zflowCarouselWired) {
      logoRow.__zflowCarouselWired = true;
      logoRow.classList.add("scrollbar-hide");
      // If it's not already horizontally scrollable, try to make it.
      logoRow.style.scrollBehavior = "smooth";
      let dir = 1;
      setInterval(() => {
        if (modal && !modal.classList.contains("hidden")) return;
        const max = logoRow.scrollWidth - logoRow.clientWidth;
        if (max <= 0) return;
        logoRow.scrollLeft += 1 * dir;
        if (logoRow.scrollLeft >= max) dir = -1;
        if (logoRow.scrollLeft <= 0) dir = 1;
      }, 20);
    }
  }


  function ensureGlobalStyles() {
    if (document.getElementById("zflowGlobalStyles")) return;
    const st = document.createElement("style");
    st.id = "zflowGlobalStyles";
    st.textContent = `
      @keyframes zflow-infinite-scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .animate-infinite-scroll {
        animation: zflow-infinite-scroll 18s linear infinite;
      }
    `;
    document.head.appendChild(st);
  }

document.addEventListener("DOMContentLoaded", () => {
    ensureGlobalStyles();
    wireMenuButton();
    wireBackButtons();
    wireCTAs();
    wireUseCaseFilters();
    wireTeamPartners();
    wireForms();
    setActiveLink();
  });
})();

