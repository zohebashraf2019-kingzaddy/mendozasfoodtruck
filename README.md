# Mendoza's Food Truck — website

Static site (HTML/CSS/JS, no build step) + one optional Vercel serverless function for card payments.

**Live sections:** video hero (auto-playing clip playlist) · bilingual EN/ES toggle · full menu with photos & cart · specials · looping reels · 2-story Double-Decker · both locations with maps · events/catering contact page.

## Deploy (Vercel)
1. Import this GitHub repo in Vercel → Framework preset **Other** → Deploy. No build command, no output dir.
2. Done. Contact form and pickup orders work immediately (see activation below).

## ⚠️ One-time email activation (FormSubmit)
The contact form and "Send pickup order" both email **Mendozasfoodtruck01@gmail.com** via [FormSubmit](https://formsubmit.co).
The **first** submission sends an activation email to that inbox → click **Activate Form** once. After that every message is delivered.
(Optional: FormSubmit then shows a random alias string — you can replace the email in `js/config.js → formEndpoint` with it to hide the address.)

## Edit content
| What | Where |
|---|---|
| Prices, dishes, descriptions (EN/ES) | `js/menu-data.js` |
| Phone, email, DoorDash link, hours, locations, payment mode | `js/config.js` |
| All page text EN/ES | `js/i18n.js` |
| Photos / videos | `assets/img`, `assets/img/menu`, `assets/video` |

## Online payments (later)
Checkout already offers: **DoorDash** delivery link · **pickup order by email (pay at truck)** · **call-in**.

**Stripe:** set `payments: "stripe"` in `js/config.js`, add `STRIPE_SECRET_KEY` (sk_live_…) in Vercel → Settings → Environment Variables, redeploy. `/api/checkout.js` re-prices every item server-side from `menu-data.js`. Optional `STRIPE_AUTOMATIC_TAX=true` once Stripe Tax is set up.

**Square:** create a Square Online / payment link, set `payments: "square"` and `squareCheckoutUrl` in `js/config.js`. (A full Square Orders API integration can replace this later.)
