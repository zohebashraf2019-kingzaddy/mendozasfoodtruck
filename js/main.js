/* Mendoza's Food Truck — site behavior: language, nav, videos, menu, locations */
(function () {
  var C = window.SITE_CONFIG, M = window.MENU_DATA;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = function (n) { return "$" + n.toFixed(2); };
  window.money = money;
  var reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- config-driven links ---------- */
  $$("[data-doordash]").forEach(function (a) { a.href = C.doordashUrl; });
  $$("[data-ig]").forEach(function (a) { a.href = C.instagram; });
  $$("[data-fb]").forEach(function (a) { a.href = C.facebook; });
  $$("[data-year]").forEach(function (s) { s.textContent = new Date().getFullYear(); });

  /* ---------- language ---------- */
  $$("[data-lang]").forEach(function (b) { b.addEventListener("click", function () { window.applyLang(b.dataset.lang); }); });

  /* ---------- nav ---------- */
  var nav = $("#nav"), burger = $("#burger"), links = $("#navLinks");
  function onScroll() { if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  if (burger) burger.addEventListener("click", function () {
    var open = links.classList.toggle("is-open"); burger.setAttribute("aria-expanded", String(open)); document.body.classList.toggle("nav-open", open);
  });
  if (links) links.addEventListener("click", function (e) {
    if (e.target.closest("a")) { links.classList.remove("is-open"); burger && burger.setAttribute("aria-expanded", "false"); document.body.classList.remove("nav-open"); }
  });

  /* ---------- reveal on scroll ---------- */
  var rio = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); rio.unobserve(e.target); } });
  }, { threshold: 0.12 }) : null;
  window.observeReveal = function (el) { if (rio) rio.observe(el); else el.classList.add("in"); };
  $$(".reveal").forEach(window.observeReveal);

  /* ---------- hero video playlist (plays as you arrive, crossfades clip → clip) ---------- */
  var HERO = [
    { src: "assets/video/hero-grill.mp4", poster: "assets/video/hero-grill.jpg", en: "On the grill", es: "En la parrilla" },
    { src: "assets/video/hero-food.mp4", poster: "assets/video/hero-food.jpg", en: "Straight gas", es: "Puro fuego" },
    { src: "assets/video/hero-birria.mp4", poster: "assets/video/hero-birria.jpg", en: "Birria time", es: "Hora de birria" }
  ];
  var vids = $$(".hero__vid"), dotsBox = $("#heroDots"), pauseBtn = $("#heroPause");
  if (vids.length === 2) {
    var cur = 0, active = 0, paused = false, MAX = 14; // seconds per clip
    HERO.forEach(function (h, i) {
      var b = document.createElement("button"); b.type = "button"; b.className = "hero__dot";
      b.innerHTML = "<i></i><span></span>"; b.addEventListener("click", function () { play(i); });
      dotsBox.appendChild(b);
    });
    function labelDots() { $$(".hero__dot span", dotsBox).forEach(function (s, i) { s.textContent = HERO[i][window.LANG] || HERO[i].en; }); }
    labelDots(); document.addEventListener("langchange", labelDots);
    function play(i) {
      cur = (i + HERO.length) % HERO.length;
      var next = vids[1 - active], prev = vids[active];
      next.src = HERO[cur].src; next.poster = HERO[cur].poster; next.currentTime = 0;
      var p = next.play(); if (p && p.catch) p.catch(function () {});
      next.classList.add("is-on"); prev.classList.remove("is-on");
      setTimeout(function () { prev.pause(); }, 900);
      active = 1 - active;
      $$(".hero__dot", dotsBox).forEach(function (d, k) { d.classList.toggle("is-on", k === cur); d.style.setProperty("--p", 0); });
    }
    vids.forEach(function (v) {
      v.addEventListener("timeupdate", function () {
        if (v !== vids[active]) return;
        var len = Math.min(v.duration || MAX, MAX), dot = $$(".hero__dot", dotsBox)[cur];
        if (dot) dot.style.setProperty("--p", Math.min(v.currentTime / len, 1));
        if (v.currentTime >= len - 0.25 && !paused) play(cur + 1);
      });
      v.addEventListener("ended", function () { if (v === vids[active] && !paused) play(cur + 1); });
    });
    // first clip: start immediately on load
    vids[0].src = HERO[0].src; active = 0;
    $$(".hero__dot", dotsBox)[0].classList.add("is-on");
    if (!reduceMotion) { var p0 = vids[0].play(); if (p0 && p0.catch) p0.catch(function () {}); }
    else { paused = true; pauseBtn.textContent = "▶"; }
    pauseBtn.addEventListener("click", function () {
      paused = !paused; var v = vids[active];
      if (paused) { v.pause(); pauseBtn.textContent = "▶"; pauseBtn.setAttribute("aria-label", "Play video"); }
      else { v.play(); pauseBtn.textContent = "❚❚"; pauseBtn.setAttribute("aria-label", "Pause video"); }
    });
  }

  /* ---------- looping reels: autoplay when on screen, pause when off ---------- */
  var vio = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) { if (v.preload === "none") v.preload = "auto"; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else v.pause();
    });
  }, { threshold: 0.35 }) : null;
  $$("video[data-autoplay]").forEach(function (v) { if (vio && !reduceMotion) vio.observe(v); });
  $$(".reel__snd").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var v = btn.parentNode.querySelector("video");
      var unmute = v.muted;
      $$("video[data-autoplay]").forEach(function (o) { o.muted = true; });
      $$(".reel__snd").forEach(function (b) { b.textContent = "🔇"; });
      v.muted = !unmute; btn.textContent = unmute ? "🔊" : "🔇";
      if (unmute) v.play();
    });
  });

  /* ---------- menu ---------- */
  var tabs = $("#menuTabs"), body = $("#menuBody");
  var EMOJI = { burritos: "🌯", drinks: "🥤", sides: "🍚", tacos: "🌮", birria: "🍲", loaded: "🍟" };
  function name(it) { return window.LANG === "es" && it.nameEs ? it.nameEs : it.name; }
  window.itemName = name;
  function badges(it) {
    return (it.badges || []).map(function (b) { return '<span class="tag tag--' + b + '">' + window.t("tag." + b) + "</span>"; }).join("");
  }
  function img(it, cls) {
    return it.img ? '<img src="' + it.img + '" alt="' + it.name + '" loading="lazy" class="' + (cls || "") + '">'
                  : '<span class="ph ' + (cls || "") + '">' + (EMOJI[it.cat] || "🌮") + "</span>";
  }
  function addBtn(it) { return '<button class="add" type="button" data-add="' + it.id + '" aria-label="' + window.t("menu.add") + " " + it.name + '"><span>+</span>' + window.t("menu.add") + "</button>"; }

  function renderMenu() {
    if (!body) return;
    tabs.innerHTML = M.CATEGORIES.map(function (c) { return '<a href="#cat-' + c.id + '">' + c[window.LANG] + "</a>"; }).join("");
    body.innerHTML = M.CATEGORIES.map(function (c) {
      var items = M.ITEMS.filter(function (i) { return i.cat === c.id; });
      var note = c.note ? '<span class="script">' + c.note[window.LANG] + "</span>" : "";
      var html;
      if (c.id === "birria" || c.id === "loaded") {
        html = '<div class="grid-cards grid-cards--' + c.id + '">' + items.map(function (it) {
          return '<article class="dish dish--card reveal" data-open="' + it.id + '"><div class="dish__img">' + img(it) + '<div class="dish__tags">' + badges(it) + '</div></div>' +
            '<div class="dish__body"><h4>' + name(it) + '<b>' + it.price.toFixed(2) + '</b></h4><p>' + it.desc[window.LANG] + "</p>" + addBtn(it) + "</div></article>";
        }).join("") + "</div>";
      } else if (c.id === "drinks") {
        html = '<div class="drinks">' + items.map(function (it) {
          return '<div class="drink reveal" data-open="' + it.id + '">' + img(it, "drink__img") + '<div><h4>' + name(it) + '</h4><small>' + it.desc[window.LANG] + (it.badges ? " · " + window.t("tag.popular") : "") + '</small></div><b>' + it.price.toFixed(2) + '</b><button class="add add--round" type="button" data-add="' + it.id + '" aria-label="' + window.t("menu.add") + " " + it.name + '">+</button></div>';
        }).join("") + "</div>";
      } else {
        var feat = items.filter(function (i) { return i.feature; })[0];
        var rest = items.filter(function (i) { return !i.feature; });
        html = (feat ? '<article class="feature reveal" data-open="' + feat.id + '"><div class="feature__img">' + img(feat) + '</div><div class="feature__body"><div class="dish__tags">' + badges(feat) + '</div><h4>' + name(feat) + '</h4><p>' + feat.desc[window.LANG] + '</p><div class="feature__row"><b>' + money(feat.price) + "</b>" + addBtn(feat) + "</div></div></article>" : "") +
          '<div class="rows">' + rest.map(function (it) {
            return '<article class="dish dish--row reveal' + (it.img ? "" : " dish--noimg") + '" data-open="' + it.id + '">' + (it.img ? '<div class="dish__thumb">' + img(it) + "</div>" : "") +
              '<div class="dish__body"><h4><span>' + name(it) + " " + badges(it) + '</span><i class="dots"></i><b>' + it.price.toFixed(2) + '</b></h4><p>' + it.desc[window.LANG] + "</p></div>" + addBtn(it) + "</article>";
          }).join("") + "</div>";
        if (c.id === "tacos") html += '<div class="meat-box reveal"><h5>' + window.t("menu.meat") + "</h5><p>" + M.MEATS.map(function (m) { return window.LANG === "es" && M.MEATS_ES[m] ? M.MEATS_ES[m] : m; }).join(" · ") + "</p></div>";
      }
      return '<section class="cat" id="cat-' + c.id + '"><header class="cat__head"><h3 class="ribbon">' + c[window.LANG] + "</h3><i></i>" + note + "</header>" + html + "</section>";
    }).join("");
    $$(".reveal", body).forEach(window.observeReveal);
  }
  renderMenu();
  document.addEventListener("langchange", renderMenu);

  // active tab while scrolling the menu
  if (body && "IntersectionObserver" in window) {
    var tio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        $$("a", tabs).forEach(function (a) { a.classList.toggle("is-on", a.getAttribute("href") === "#" + e.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    var watchCats = function () { $$(".cat", body).forEach(function (s) { tio.observe(s); }); };
    watchCats(); document.addEventListener("langchange", watchCats);
  }

  /* ---------- locations ---------- */
  var locBox = $("#locations");
  function renderLocs() {
    if (!locBox) return;
    locBox.innerHTML = C.locations.map(function (l) {
      return '<article class="loc reveal' + (l.primary ? " loc--main" : "") + '">' +
        '<div class="loc__map"><iframe title="Map: ' + l.address + '" src="' + l.embed + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>' +
        '<div class="loc__body">' + (l.primary ? '<span class="tag tag--fav">' + window.t("visit.main") + "</span>" : "") +
        "<h3>" + l.name[window.LANG] + "</h3><p class=\"loc__addr\">" + l.address + "</p><p><b>" + l.hours[window.LANG] + "</b><br>" + l.perks[window.LANG] + "</p>" +
        '<div class="loc__btns"><a class="btn btn--red btn--sm" href="' + l.map + '" target="_blank" rel="noopener">' + window.t("visit.dir") + ' ↗</a>' +
        '<button class="btn btn--line btn--sm" type="button" data-pick-loc="' + l.id + '">' + window.t("visit.order") + "</button></div></div></article>";
    }).join("") + '<article class="loc loc--soon reveal"><div class="loc__body"><span class="big">3</span><h3>' + window.t("visit.sub") + "</h3><p>@mendozasfoodtruck</p></div></article>";
    $$(".reveal", locBox).forEach(window.observeReveal);
  }
  renderLocs();
  document.addEventListener("langchange", renderLocs);

  window.applyLang();
})();
