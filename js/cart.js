/* Mendoza's Food Truck — cart, item options, checkout */
(function () {
  var C = window.SITE_CONFIG, M = window.MENU_DATA;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = window.money || function (n) { return "$" + n.toFixed(2); };
  var KEY = "mft_cart_v1", LKEY = "mft_loc";
  var byId = {}; M.ITEMS.forEach(function (i) { byId[i.id] = i; });

  var cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY) || "[]").filter(function (l) { return byId[l.id]; }); } catch (e) { cart = []; }
  var loc = (function () { try { return localStorage.getItem(LKEY); } catch (e) { return null; } })() || C.locations[0].id;
  function save() { try { localStorage.setItem(KEY, JSON.stringify(cart)); localStorage.setItem(LKEY, loc); } catch (e) {} }

  function optLabel(key, val) {
    var o = M.OPTIONS[key]; if (window.LANG !== "es") return val;
    if (key === "meat") return M.MEATS_ES[val] || val;
    return (o.es && o.es[val]) || val;
  }
  function lineKey(l) { return l.id + "|" + JSON.stringify(l.opts || {}) + "|" + (l.notes || ""); }
  function total() { return cart.reduce(function (s, l) { return s + byId[l.id].price * l.qty; }, 0); }
  function count() { return cart.reduce(function (s, l) { return s + l.qty; }, 0); }

  function add(id, opts, qty, notes) {
    var line = { id: id, opts: opts || {}, qty: qty || 1, notes: notes || "" };
    var k = lineKey(line), found = cart.filter(function (l) { return lineKey(l) === k; })[0];
    if (found) found.qty += line.qty; else cart.push(line);
    save(); render(); bump();
    toast(window.itemName(byId[id]) + " — " + window.t("cart.added"));
  }

  /* ---------- toast + bump ---------- */
  var toastEl = $("#toast"), tt;
  function toast(msg) { if (!toastEl) return; toastEl.textContent = msg; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(function () { toastEl.classList.remove("show"); }, 2200); }
  function bump() { $$(".cart-count, .mbar").forEach(function (el) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }); }

  /* ---------- options modal ---------- */
  var modal = $("#optModal"), cur = null, qty = 1;
  function openItem(id) {
    var it = byId[id]; if (!it) return;
    if (!it.options || !it.options.length) { add(id, {}, 1, ""); return; }
    cur = it; qty = 1;
    $("#optTitle").textContent = window.itemName(it);
    $("#optDesc").textContent = it.desc[window.LANG];
    $("#optImg").innerHTML = it.img ? '<img src="' + it.img + '" alt="">' : "";
    $("#optImg").hidden = !it.img;
    $("#optNotes").value = "";
    $("#optFields").innerHTML = it.options.map(function (key) {
      var o = M.OPTIONS[key];
      return '<fieldset class="chips"><legend>' + o.label[window.LANG] + "</legend>" + o.choices.map(function (ch, i) {
        return '<label><input type="radio" name="opt-' + key + '" value="' + ch + '"' + (i === 0 ? " checked" : "") + "><span>" + optLabel(key, ch) + "</span></label>";
      }).join("") + "</fieldset>";
    }).join("");
    upd();
    modal.hidden = false; document.body.classList.add("lock");
    setTimeout(function () { var f = modal.querySelector("input"); if (f) f.focus(); }, 30);
  }
  window.openItem = openItem;
  function upd() { $("#optQty").textContent = qty; $("#optPrice").textContent = money(cur.price * qty); }
  function closeModal() { if (modal) { modal.hidden = true; document.body.classList.remove("lock"); } }
  if (modal) {
    $$("[data-close-modal]", modal).forEach(function (b) { b.addEventListener("click", closeModal); });
    $$("[data-q]", modal).forEach(function (b) { b.addEventListener("click", function () { qty = Math.max(1, Math.min(50, qty + Number(b.dataset.q))); upd(); }); });
    $("#optAdd").addEventListener("click", function () {
      var opts = {};
      cur.options.forEach(function (k) { var r = modal.querySelector('input[name="opt-' + k + '"]:checked'); if (r) opts[k] = r.value; });
      add(cur.id, opts, qty, $("#optNotes").value.trim());
      closeModal();
    });
  }

  /* ---------- clicks: add buttons & cards ---------- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-add]");
    if (a) { e.preventDefault(); e.stopPropagation(); openItem(a.getAttribute("data-add")); return; }
    var card = e.target.closest("[data-open]");
    if (card && !e.target.closest("a,button")) openItem(card.getAttribute("data-open"));
    var pl = e.target.closest("[data-pick-loc]");
    if (pl) { loc = pl.getAttribute("data-pick-loc"); save(); render(); location.hash = "#menu"; toast(locName(loc)); }
  });

  /* ---------- drawer ---------- */
  var drawer = $("#drawer");
  function openCart() { if (!drawer) return; drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); document.body.classList.add("lock"); }
  function closeCart() { if (!drawer) return; drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); document.body.classList.remove("lock"); }
  $$("[data-open-cart]").forEach(function (b) { b.addEventListener("click", openCart); });
  $$("[data-close-cart]").forEach(function (b) { b.addEventListener("click", closeCart); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeModal(); closeCart(); } });

  function locName(id) { var l = C.locations.filter(function (x) { return x.id === id; })[0] || C.locations[0]; return l.name[window.LANG]; }

  function render() {
    $$("[data-cart-count]").forEach(function (el) { el.textContent = count(); });
    $$("[data-cart-total]").forEach(function (el) { el.textContent = money(total()); });
    document.body.classList.toggle("has-cart", count() > 0);
    var box = $("#cartItems"); if (!box) return;
    $("#cartEmpty").hidden = cart.length > 0;
    $("#checkout").hidden = cart.length === 0;
    box.innerHTML = cart.map(function (l, i) {
      var it = byId[l.id];
      var opts = Object.keys(l.opts || {}).map(function (k) { return optLabel(k, l.opts[k]); });
      if (l.notes) opts.push("“" + l.notes + "”");
      return '<div class="line">' + (it.img ? '<img src="' + it.img + '" alt="">' : '<span class="ph">🌮</span>') +
        '<div class="line__info"><b>' + window.itemName(it) + "</b>" + (opts.length ? "<small>" + escapeHtml(opts.join(" · ")) + "</small>" : "") +
        '<div class="qty qty--sm"><button type="button" data-line="' + i + '" data-d="-1" aria-label="Less">−</button><output>' + l.qty + '</output><button type="button" data-line="' + i + '" data-d="1" aria-label="More">+</button></div></div>' +
        '<div class="line__price">' + money(it.price * l.qty) + '<button type="button" class="rm" data-rm="' + i + '">' + window.t("cart.remove") + "</button></div></div>";
    }).join("");
    var sel = $("#coLoc");
    sel.innerHTML = C.locations.map(function (l) { return '<option value="' + l.id + '"' + (l.id === loc ? " selected" : "") + ">" + l.name[window.LANG] + " — " + l.address + "</option>"; }).join("");
    $("#coPay").hidden = C.payments === "none";
    $("#coPickToggle").hidden = !C.allowPickupRequests;
  }
  function escapeHtml(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  var items = $("#cartItems");
  if (items) items.addEventListener("click", function (e) {
    var b = e.target.closest("[data-d]"), r = e.target.closest("[data-rm]");
    if (b) { var l = cart[+b.dataset.line]; l.qty += +b.dataset.d; if (l.qty < 1) cart.splice(+b.dataset.line, 1); }
    else if (r) cart.splice(+r.dataset.rm, 1); else return;
    save(); render();
  });
  var sel = $("#coLoc"); if (sel) sel.addEventListener("change", function () { loc = sel.value; save(); });
  var clr = $("#cartClear"); if (clr) clr.addEventListener("click", function () { cart = []; save(); render(); });

  /* ---------- order summary text ---------- */
  function summary() {
    return cart.map(function (l) {
      var it = byId[l.id], o = Object.keys(l.opts || {}).map(function (k) { return l.opts[k]; });
      return l.qty + " x " + it.name + (o.length ? " (" + o.join(", ") + ")" : "") + (l.notes ? " — note: " + l.notes : "") + "  " + money(it.price * l.qty);
    }).join("\n") + "\n\nSubtotal: " + money(total()) + " (+ tax)";
  }

  /* ---------- checkout: pickup request via email ---------- */
  var pickT = $("#coPickToggle"), pickF = $("#pickForm"), pickMsg = $("#pickMsg");
  if (pickT) pickT.addEventListener("click", function () { pickF.hidden = !pickF.hidden; if (!pickF.hidden) pickF.querySelector("input").focus(); });
  if (pickF) pickF.addEventListener("submit", function (e) {
    e.preventDefault();
    var fd = new FormData(pickF), btn = pickF.querySelector("button");
    var l = C.locations.filter(function (x) { return x.id === loc; })[0];
    var payload = {
      _subject: "🌮 New PICKUP order — " + l.name.en + " — " + fd.get("name"),
      _template: "box", _captcha: "false",
      "Order type": "Pickup · pay at truck",
      "Pickup location": l.name.en + " (" + l.address + ")",
      "Pickup time": fd.get("pickup_time") || "ASAP",
      Name: fd.get("name"), Phone: fd.get("phone"),
      Order: summary(), Language: window.LANG.toUpperCase()
    };
    btn.disabled = true; pickMsg.className = "form-msg"; pickMsg.textContent = window.t("co.sending");
    fetch(C.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok || j.success === "false" || j.success === false) throw new Error(j.message || "fail"); }); })
      .then(function () { pickMsg.className = "form-msg ok"; pickMsg.textContent = window.t("co.sent"); cart = []; save(); setTimeout(render, 2500); pickF.reset(); })
      .catch(function () { pickMsg.className = "form-msg err"; pickMsg.textContent = window.t("co.err"); })
      .then(function () { btn.disabled = false; });
  });

  /* ---------- checkout: online payment (Stripe / Square) ---------- */
  var pay = $("#coPay");
  if (pay) pay.addEventListener("click", function () {
    if (C.payments === "square" && C.squareCheckoutUrl) { window.open(C.squareCheckoutUrl, "_blank", "noopener"); return; }
    if (C.payments !== "stripe") { toast(window.t("co.payErr")); return; }
    pay.disabled = true;
    fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location: loc, lang: window.LANG, items: cart }) })
      .then(function (r) { return r.json(); })
      .then(function (j) { if (j.url) location.href = j.url; else throw new Error(j.error); })
      .catch(function () { toast(window.t("co.payErr")); })
      .then(function () { pay.disabled = false; });
  });
  if (/[?&]paid=1/.test(location.search)) { cart = []; save(); setTimeout(function () { toast("¡Gracias! Payment received — see you at the truck 🌮"); }, 600); }

  document.addEventListener("langchange", render);
  render();
})();
