/* Vercel serverless function: creates a Stripe Checkout session for pickup orders.
   Inactive until STRIPE_SECRET_KEY is set in Vercel → Project → Settings → Environment Variables
   and SITE_CONFIG.payments is set to "stripe" in js/config.js.
   Prices are always re-read from js/menu-data.js on the server, never trusted from the browser. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

function loadMenu() {
  const code = fs.readFileSync(path.join(process.cwd(), "js", "menu-data.js"), "utf8");
  const sandbox = { window: {} };
  vm.runInNewContext(code, sandbox);
  return sandbox.window.MENU_DATA;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) { res.status(501).json({ error: "Online payments not configured yet" }); return; }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const menu = loadMenu();
    const byId = Object.fromEntries(menu.ITEMS.map((i) => [i.id, i]));
    const items = Array.isArray(body.items) ? body.items.slice(0, 60) : [];
    if (!items.length) { res.status(400).json({ error: "Cart is empty" }); return; }

    const origin = req.headers.origin || `https://${req.headers.host}`;
    const p = new URLSearchParams();
    p.append("mode", "payment");
    p.append("success_url", `${origin}/?paid=1#menu`);
    p.append("cancel_url", `${origin}/#menu`);
    p.append("phone_number_collection[enabled]", "true");
    p.append("automatic_tax[enabled]", process.env.STRIPE_AUTOMATIC_TAX === "true" ? "true" : "false");
    p.append("locale", body.lang === "es" ? "es" : "en");
    p.append("metadata[pickup_location]", String(body.location || "sun-valley").slice(0, 40));

    let n = 0;
    for (const line of items) {
      const it = byId[line.id];
      const qty = Math.max(1, Math.min(50, parseInt(line.qty, 10) || 1));
      if (!it) continue;
      const opts = Object.values(line.opts || {}).map(String).join(", ");
      const desc = [opts, line.notes ? `Note: ${String(line.notes).slice(0, 120)}` : ""].filter(Boolean).join(" · ");
      p.append(`line_items[${n}][quantity]`, String(qty));
      p.append(`line_items[${n}][price_data][currency]`, "usd");
      p.append(`line_items[${n}][price_data][unit_amount]`, String(Math.round(it.price * 100)));
      p.append(`line_items[${n}][price_data][product_data][name]`, it.name);
      if (desc) p.append(`line_items[${n}][price_data][product_data][description]`, desc);
      n++;
    }
    if (!n) { res.status(400).json({ error: "No valid items" }); return; }

    const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: p.toString()
    });
    const j = await r.json();
    if (!r.ok) { res.status(502).json({ error: (j.error && j.error.message) || "Stripe error" }); return; }
    res.status(200).json({ url: j.url });
  } catch (e) {
    res.status(500).json({ error: "Checkout failed" });
  }
};
