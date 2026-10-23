/* ============================================================
   SITE CONFIG — edit these values, no other code changes needed
   ============================================================ */
window.SITE_CONFIG = {
  businessName: "Mendoza's Food Truck",
  phone: "(775) 420-8344",
  phoneHref: "+17754208344",
  email: "Mendozasfoodtruck01@gmail.com",

  // Contact + pickup-order emails are delivered through FormSubmit (no server needed).
  // The FIRST submission sends an activation email to this inbox — click "Activate" once.
  formEndpoint: "https://formsubmit.co/ajax/Mendozasfoodtruck01@gmail.com",

  doordashUrl: "https://www.doordash.com/store/mendozas-food-truck-sun-valley-24240133/16942631/",
  instagram: "https://www.instagram.com/mendozasfoodtruck/",
  facebook: "https://www.facebook.com/profile.php?id=61582075576493",

  /* ONLINE PAYMENTS
     "none"   → checkout offers DoorDash, pickup request (pay at truck) and call-in.
     "stripe" → adds "Pay online" button. Requires STRIPE_SECRET_KEY env var in Vercel (see README).
     "square" → adds "Pay online" button that opens squareCheckoutUrl (a Square Online / payment link). */
  payments: "none",
  squareCheckoutUrl: "",

  // Lets customers send a pickup order to the truck by email and pay at pickup.
  allowPickupRequests: true,

  locations: [
    {
      id: "sun-valley",
      name: { en: "Truck #1 · Sun Valley", es: "Troca #1 · Sun Valley" },
      address: "5425 Sun Valley Blvd, Sun Valley, NV 89433",
      hours: { en: "Open 7 days · 4 PM – Midnight", es: "Abierto 7 días · 4 PM – Medianoche" },
      perks: { en: "Covered patio · Indoor dining room", es: "Patio techado · Comedor interior" },
      map: "https://www.google.com/maps/search/?api=1&query=5425+Sun+Valley+Blvd+Sun+Valley+NV+89433",
      embed: "https://maps.google.com/maps?q=5425%20Sun%20Valley%20Blvd%2C%20Sun%20Valley%2C%20NV%2089433&z=15&output=embed",
      primary: true
    },
    {
      id: "south-meadows",
      name: { en: "Truck #2 · South Meadows", es: "Troca #2 · South Meadows" },
      address: "500 S Meadows Pkwy, Reno, NV 89521",
      hours: { en: "Open 7 days · 11 AM – 8 PM", es: "Abierto 7 días · 11 AM – 8 PM" },
      perks: { en: "Lunch & dinner in South Reno", es: "Comida y cena en el sur de Reno" },
      map: "https://www.google.com/maps/search/?api=1&query=500+S+Meadows+Pkwy+Reno+NV",
      embed: "https://maps.google.com/maps?q=500%20S%20Meadows%20Pkwy%2C%20Reno%2C%20NV&z=15&output=embed"
    }
  ]
};
