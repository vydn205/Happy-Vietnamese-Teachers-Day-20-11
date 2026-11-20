(() => {
  "use strict";
  const CFG = window.CARD_CONFIG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduced ? 0 : ms));

  /* ---------- Fill config-driven text ---------- */
  $$("[data-teacher]").forEach((el) => (el.textContent = CFG.teacherName));

  /* ---------- Scenes ---------- */
  let current = "welcome";
  function go(name) {
    const from = $("#scene-" + current);
    const to = $("#scene-" + name);
    from.classList.remove("active");
    to.hidden = false;
    // next frame so the opacity transition runs
    requestAnimationFrame(() => requestAnimationFrame(() => {
      to.classList.add("active");
      to.scrollTop = 0;
      const h = $("[tabindex='-1']", to);
      if (h) h.focus({ preventScroll: true });
    }));
    setTimeout(() => { if (current !== from.id.replace("scene-", "")) from.hidden = true; }, 900);
    current = name;
  }

  /* ---------- Gift illustration (shared) ---------- */
  const giftSVG = `
  <svg viewBox="0 0 240 230" role="img" aria-label="A gift box with roses">
    <ellipse cx="120" cy="222" rx="92" ry="7" fill="rgba(110,31,51,.15)"/>
    <rect x="34" y="104" width="172" height="112" rx="6" fill="#8a2a41"/>
    <rect x="34" y="104" width="172" height="14" fill="#000" opacity=".12"/>
    <rect x="107" y="104" width="26" height="112" fill="#d8bc72"/>
    <g class="blooms">
      <path d="M120 100 C118 70 100 55 84 44 M120 100 C124 68 148 52 166 46" stroke="#6f7f5e" stroke-width="3" fill="none" stroke-linecap="round"/>
      <use href="#leaf" x="92" y="58" width="20" height="40" transform="rotate(-40 102 78)"/>
      <use href="#leaf" x="130" y="58" width="20" height="40" transform="rotate(40 140 78)"/>
      <use href="#rose" x="52" y="14" width="64" height="64"/>
      <use href="#rose" x="124" y="8" width="70" height="70"/>
      <use href="#bud" x="96" y="-6" width="40" height="40"/>
    </g>
    <g class="lid">
      <rect x="22" y="72" width="196" height="38" rx="6" fill="#a13350"/>
      <rect x="107" y="72" width="26" height="38" fill="#e3c982"/>
      <path d="M120 70c-16-30-48-26-42-8 5 14 30 12 42 8z" fill="#e3c982" stroke="#b99a4a" stroke-width="1.2"/>
      <path d="M120 70c16-30 48-26 42-8-5 14-30 12-42 8z" fill="#e3c982" stroke="#b99a4a" stroke-width="1.2"/>
      <circle cx="120" cy="68" r="8" fill="#d8bc72" stroke="#b99a4a" stroke-width="1.2"/>
    </g>
  </svg>`;
  $("#gift").innerHTML = giftSVG;
  $("#gift-done").innerHTML = giftSVG;

  /* ---------- Falling petals ---------- */
  function makePetals() {
    if (reduced) return;
    const wrap = $("#petals");
    const n = innerWidth < 600 ? 9 : 16;
    const cols = ["#e8b4be", "#d68a9b", "#f1cdd0", "#c9788c"];
    for (let i = 0; i < n; i++) {
      const p = document.createElement("div");
      p.className = "petal";
      p.style.left = Math.random() * 100 + "vw";
      p.style.color = cols[i % cols.length];
      p.style.animationDuration = 12 + Math.random() * 12 + "s";
      p.style.animationDelay = -Math.random() * 20 + "s";
      p.style.setProperty("--dx", (Math.random() * 160 - 80).toFixed(0) + "px");
      p.style.setProperty("--rot", (Math.random() * 540 - 270).toFixed(0) + "deg");
      p.style.transform = `scale(${0.7 + Math.random() * 0.7})`;
      p.innerHTML = '<svg viewBox="0 0 30 40"><use href="#petal"/></svg>';
      wrap.appendChild(p);
    }
  }
  makePetals();

  /* ---------- Confetti (gentle) ---------- */
  function confetti() {
    if (reduced) return;
    const c = $("#confetti");
    const ctx = c.getContext("2d");
    const dpr = Math.min(devicePixelRatio || 1, 2);
    c.width = innerWidth * dpr; c.height = innerHeight * dpr;
    ctx.scale(dpr, dpr);
    const cols = ["#c4a35a", "#e8b4be", "#b4546a", "#f4d9d9", "#6e1f33"];
    const bits = Array.from({ length: 110 }, () => ({
      x: innerWidth / 2 + (Math.random() - 0.5) * 120,
      y: innerHeight * 0.4,
      vx: (Math.random() - 0.5) * 9,
      vy: -Math.random() * 9 - 3,
      w: 5 + Math.random() * 6, h: 3 + Math.random() * 5,
      r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
      c: cols[(Math.random() * cols.length) | 0],
    }));
    const t0 = performance.now();
    (function tick(now) {
      const t = now - t0;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      const alpha = Math.max(0, 1 - (t - 3000) / 1500);
      bits.forEach((b) => {
        b.vy += 0.16; b.vx *= 0.995; b.x += b.vx; b.y += b.vy; b.r += b.vr;
        ctx.save(); ctx.globalAlpha = alpha; ctx.translate(b.x, b.y); ctx.rotate(b.r);
        ctx.fillStyle = b.c; ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h); ctx.restore();
      });
      if (t < 4500) requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, innerWidth, innerHeight);
    })(t0);
  }

  /* ---------- 1. Welcome → open envelope ---------- */
  const btnOpen = $("#btn-open");
  btnOpen.addEventListener("click", async () => {
    btnOpen.disabled = true;
    $("#envelope").classList.add("open");
    await wait(1900);
    startLetter();
    go("letter");
  });

  /* ---------- 2. Letter ---------- */
  let letterBuilt = false;
  async function startLetter() {
    const body = $("#letter-body"), sign = $("#letter-sign"), more = $("#btn-more");
    if (!letterBuilt) {
      body.innerHTML = CFG.letter.map((t) => `<p class="line"></p>`).join("");
      $$("p", body).forEach((p, i) => (p.textContent = CFG.letter[i]));
      sign.innerHTML = `<span class="line">${CFG.signature[0]}</span><span class="script line">${CFG.signature[1]}</span>`;
      letterBuilt = true;
    }
    $$(".line", $("#paper")).forEach((l) => l.classList.remove("in"));
    more.hidden = true;
    const paper = $("#paper");
    paper.classList.remove("enter"); void paper.offsetWidth; paper.classList.add("enter");
    await wait(900);
    for (const l of $$(".line", $("#paper"))) {
      l.classList.add("in");
      await wait(1100);
    }
    more.hidden = false;
    more.focus({ preventScroll: true });
    more.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" });
  }
  $("#btn-more").addEventListener("click", async () => {
    go("gift");
    const gift = $("#gift");
    gift.classList.remove("open", "bob");
    const items = $$("#scene-gift .reveal");
    items.forEach((i) => i.classList.remove("in"));
    await wait(1200);
    gift.classList.add("open");
    await wait(1400);
    gift.classList.add("bob");
    for (const it of items) { it.classList.add("in"); await wait(1300); }
  });

  /* ---------- 3. Gift reply → form ---------- */
  $$("#gift-actions [data-reply]").forEach((b) =>
    b.addEventListener("click", () => {
      $("#gift_reply").value = b.dataset.reply;
      go("form");
    })
  );

  /* ---------- 4. Form ---------- */
  const form = $("#delivery-form");
  const D = CFG.defaults;
  $("#fullName").value = D.fullName;
  $("#country").value = D.country;
  $("#city").value = D.city;

  const endpointReady = () =>
    /^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/.test(CFG.formEndpoint) && !/YOUR_FORM_ID/.test(CFG.formEndpoint);

  const warn = $("#config-warning");
  if (!endpointReady()) {
    warn.hidden = false;
    warn.textContent =
      "Setup note for the team: the form isn't connected yet. Add your Formspree link in config.js (see README) — until then, nothing can be sent.";
  }

  const rules = {
    fullName: (v) => (v.trim().length >= 2 ? "" : "Please tell us the name to put on the parcel."),
    phone: (v) => {
      v = v.trim();
      if (!v) return "A phone number helps the courier reach you — please add one.";
      if (!/^\+/.test(v)) return "Please start with the country code, e.g. +36 for Hungary.";
      if (!/^\+[\d\s().-]+$/.test(v)) return "Phone numbers can only contain digits, spaces, + ( ) - .";
      const d = v.replace(/\D/g, "");
      if (d.length < 8 || d.length > 15) return "That looks a bit short or long — please check the number (8–15 digits).";
      if (/^\+36/.test(v) && (d.length < 10 || d.length > 11))
        return "Hungarian numbers look like +36 20 123 4567 — could you double-check?";
      return "";
    },
    country: (v) => (v.trim() ? "" : "Please enter the country."),
    city: (v) => (v.trim() ? "" : "Please enter the city."),
    street: (v) => {
      v = v.trim();
      if (!v) return "Please add the street name and house number.";
      if (!/\d/.test(v)) return "Please include the house number as well, e.g. Váci utca 12.";
      return "";
    },
    postal: (v) => {
      v = v.trim();
      if (!v) return "Please add the postal code.";
      if (/^hungary|magyarország$/i.test($("#country").value.trim()) && !/^\d{4}$/.test(v))
        return "Hungarian postal codes have 4 digits, e.g. 1052.";
      if (!/^[A-Za-z0-9][A-Za-z0-9 -]{1,9}$/.test(v)) return "That postal code doesn't look quite right.";
      return "";
    },
  };

  function check(id) {
    const el = $("#" + id), msg = rules[id](el.value);
    const err = $("#err-" + id);
    err.textContent = msg;
    el.setAttribute("aria-invalid", msg ? "true" : "false");
    if (msg) el.setAttribute("aria-describedby", [el.getAttribute("aria-describedby"), "err-" + id].filter((x, i, a) => x && a.indexOf(x) === i).join(" "));
    return !msg;
  }
  Object.keys(rules).forEach((id) => {
    const el = $("#" + id);
    el.addEventListener("blur", () => check(id));
    el.addEventListener("input", () => el.getAttribute("aria-invalid") === "true" && check(id));
  });
  $("#country").addEventListener("input", () => $("#postal").value && check("postal"));

  const submitErr = $("#submit-error");
  const showError = (m) => { submitErr.textContent = m; submitErr.hidden = false; };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitErr.hidden = true;
    const bad = Object.keys(rules).filter((id) => !check(id));
    if (bad.length) { $("#" + bad[0]).focus(); return; }

    if (!endpointReady()) {
      showError("The form isn't connected to an inbox yet, so nothing was sent. Please set the Formspree link in config.js first.");
      return;
    }

    const f = new FormData(form);
    if (f.get("_gotcha")) return; // bot
    const payload = {
      _subject: `Gift delivery details from ${f.get("full_name")}`,
      full_name: f.get("full_name"), phone: f.get("phone"), country: f.get("country"),
      city: f.get("city"), street: f.get("street"), apartment_floor_door: f.get("unit") || "",
      postal_code: f.get("postal_code"), delivery_instructions: f.get("notes") || "",
      gift_reply: f.get("gift_reply"),
    };

    const btn = $("#btn-submit"), label = btn.textContent;
    btn.disabled = true; btn.textContent = "Sending…";
    try {
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), 20000);
      const res = await fetch(CFG.formEndpoint, {
        method: "POST", signal: ctl.signal,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      clearTimeout(timer);
      if (!res.ok) {
        let detail = "";
        try { const j = await res.json(); detail = (j.errors || []).map((x) => x.message).join(" "); } catch (_) {}
        throw new Error(detail || "The server answered with status " + res.status + ".");
      }
      go("done");
      setTimeout(confetti, 700);
    } catch (err) {
      const offline = !navigator.onLine;
      showError(
        (offline ? "You seem to be offline. " : "Sorry, we couldn't send your details just now. ") +
        "Nothing was saved — please try again in a moment. " +
        (err && err.name !== "AbortError" && err.message && !offline ? "(" + err.message + ")" : "")
      );
    } finally {
      btn.disabled = false; btn.textContent = label;
    }
  });

  /* ---------- 5. Done ---------- */
  $("#btn-reread").addEventListener("click", () => {
    $$("#letter-body .line, #letter-sign .line").forEach((l) => l.classList.add("in"));
    $("#btn-more").hidden = false;
    go("letter");
  });
  $("#btn-replay").addEventListener("click", () => {
    const env = $("#envelope");
    env.classList.remove("open");
    btnOpen.disabled = false;
    go("welcome");
  });
})();
