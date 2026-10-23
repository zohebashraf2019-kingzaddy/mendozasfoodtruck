/* Mendoza's Food Truck — menu data (single source of truth).
   Used by the website AND by /api/checkout.js for server-side price checks.
   Edit prices here only. */
(function (root) {
  var MEATS = ["Asada", "Al Pastor", "Birria", "Chorizo", "Chicken", "Carnitas", "Lengua", "Tripa", "Cabeza"];
  var MEATS_ES = { "Chicken": "Pollo" };

  var OPTIONS = {
    meat: { label: { en: "Choose your meat", es: "Elige tu carne" }, choices: MEATS },
    quesadilla: { label: { en: "Choose your filling", es: "Elige tu relleno" }, choices: ["Sausage", "Ham", "Chorizo"], es: { Sausage: "Salchicha", Ham: "Jamón" } },
    salsa: { label: { en: "Salsa", es: "Salsa" }, choices: ["Red", "Green"], es: { Red: "Roja", Green: "Verde" } }
  };

  var CATEGORIES = [
    { id: "birria", en: "Birria Specialties", es: "Especialidades de Birria", note: { en: "served with consomé", es: "servido con consomé" } },
    { id: "tacos", en: "Tacos & Quesadillas", es: "Tacos y Quesadillas" },
    { id: "loaded", en: "Loaded & Shareable", es: "Para Compartir" },
    { id: "burritos", en: "Burritos & Tortas", es: "Burritos y Tortas" },
    { id: "sides", en: "Sides", es: "Acompañantes" },
    { id: "drinks", en: "Bebidas", es: "Bebidas", note: { en: "drinks", es: "refrescantes" } }
  ];

  var I = "assets/img/menu/";
  var ITEMS = [
    // BIRRIA
    { id: "quesabirria-trio", cat: "birria", name: "Quesabirria Trio", price: 14.99, img: I + "quesabirria.jpg", badges: ["fav"],
      desc: { en: "3 birria tacos with mozzarella, onions & cilantro. Served with consomé, salsa, limes, grilled jalapeños & grilled onions.",
              es: "3 tacos de birria con mozzarella, cebolla y cilantro. Con consomé, salsa, limones, jalapeños y cebollas asadas." } },
    { id: "hot-cheetos-bombs", cat: "birria", name: "Hot Cheetos Birria Bombs", price: 13.99, img: I + "hot-cheetos-bombs.jpg", badges: ["mustTry"],
      desc: { en: "2 large Hot Cheeto birria bombs with consomé, salsa & lime. A must try!",
              es: "2 bombas grandes de birria con Hot Cheetos, consomé, salsa y limón. ¡Tienes que probarlas!" } },
    { id: "birria-ramen", cat: "birria", name: "Birria Ramen", price: 14.99, img: I + "birria-ramen.jpg",
      desc: { en: "Birria and ramen together with onions, cilantro & melted mozzarella.",
              es: "Birria y ramen juntos con cebolla, cilantro y mozzarella derretido." } },
    { id: "pizzabirria", cat: "birria", name: "PizzaBirria", price: 28.99, img: I + "pizzabirria.jpg", badges: ["new"],
      desc: { en: "Large double flour tortilla, mozzarella, shredded birria, onions & cilantro. With consomé, grilled jalapeños & onions.",
              es: "Doble tortilla de harina grande, mozzarella, birria deshebrada, cebolla y cilantro. Con consomé, jalapeños y cebollas asadas." } },

    // TACOS & QUESADILLAS
    { id: "street-taco-trio", cat: "tacos", name: "Street Taco Trio", price: 11.99, img: I + "street-tacos.jpg", options: ["meat"],
      desc: { en: "Corn tortillas with your choice of meat, onions & cilantro. With salsa, limes, grilled jalapeños & onions.",
              es: "Tortillas de maíz con tu carne favorita, cebolla y cilantro. Con salsa, limones, jalapeños y cebollas asadas." } },
    { id: "quesa-taco-trio", cat: "tacos", name: "Quesa Taco Trio", price: 13.99, img: I + "quesa-tacos.jpg", options: ["meat", "salsa"],
      desc: { en: "A trio of cheesy tacos with your choice of protein and red or green salsa.",
              es: "Tres tacos con queso, con la proteína de tu elección y salsa roja o verde." } },
    { id: "mulita", cat: "tacos", name: "Mulita", price: 7.49, img: I + "mulita.jpg", options: ["meat"],
      desc: { en: "A double-deck quesadilla loaded with gooey mozzarella and your choice of meat. With salsa, limes & grilled veggies.",
              es: "Quesadilla de dos pisos rellena de mozzarella derretido y tu carne favorita. Con salsa, limones y verduras asadas." } },
    { id: "quesadilla", cat: "tacos", name: "Quesadilla", price: 13.99, img: I + "quesadilla.jpg", options: ["quesadilla"],
      desc: { en: "Big flour tortilla with cheese and your choice of sausage, ham or chorizo.",
              es: "Tortilla de harina grande con queso y tu elección de salchicha, jamón o chorizo." } },
    { id: "pupusas", cat: "tacos", name: "Pupusas", price: 4.99, img: I + "pupusas.jpg", badges: ["new"],
      desc: { en: "Served individually with a side of repollo (cabbage slaw) & salsa.",
              es: "Se sirven por pieza con curtido de repollo y salsa." } },

    // LOADED
    { id: "carne-asada-fries", cat: "loaded", name: "Carne Asada Fries", price: 14.99, img: I + "asada-fries.jpg", options: ["meat"],
      desc: { en: "Crispy fries topped with your choice of meat, shredded cheese, sour cream, onions, cilantro & avocado salsa.",
              es: "Papas fritas crujientes con tu carne favorita, queso, crema, cebolla, cilantro y salsa de aguacate." } },
    { id: "super-nachos", cat: "loaded", name: "Super Nachos", price: 14.99, img: I + "super-nachos.jpg", options: ["meat"],
      desc: { en: "Tortilla chips with your choice of meat, mozzarella, nacho cheese, tomato, cilantro, onions, sour cream & guacamole.",
              es: "Totopos con tu carne favorita, mozzarella, queso nacho, tomate, cilantro, cebolla, crema y guacamole." } },

    // BURRITOS & TORTAS
    { id: "super-burrito", cat: "burritos", name: "Super Burrito", price: 14.99, img: I + "super-burrito.jpg", badges: ["new", "popular"], options: ["meat"], feature: true,
      desc: { en: "Your favorite burrito, just better: choice of meat, rice, beans, mozzarella, onions, cilantro, sour cream & of course guacamole!",
              es: "Tu burrito favorito, pero mejor: carne a elegir, arroz, frijoles, mozzarella, cebolla, cilantro, crema y ¡claro, guacamole!" } },
    { id: "burrito", cat: "burritos", name: "Burrito", price: 14.99, img: I + "burrito.jpg", options: ["meat"],
      desc: { en: "Large flour tortilla with your choice of meat, rice, beans, cilantro, onions & mozzarella. Homemade salsa on the side.",
              es: "Tortilla de harina grande con tu carne favorita, arroz, frijoles, cilantro, cebolla y mozzarella. Salsa casera aparte." } },
    { id: "torta", cat: "burritos", name: "Torta", price: 13.99, img: I + "torta.jpg", options: ["meat"],
      desc: { en: "Asada, al pastor, birria, chorizo, chicken, carnitas, lengua, tripa or cabeza.",
              es: "Asada, al pastor, birria, chorizo, pollo, carnitas, lengua, tripa o cabeza." } },
    { id: "cali-burrito", cat: "burritos", name: "Cali Burrito", price: 14.99, options: ["meat"],
      desc: { en: "Fries, pico de gallo, guacamole, cream, meat & cheese.",
              es: "Papas fritas, pico de gallo, guacamole, crema, carne y queso." } },
    { id: "breakfast-burrito", cat: "burritos", name: "Breakfast Burrito", price: 14.99, options: ["meat"],
      desc: { en: "Potatoes, meat, eggs, beans & cheese.", es: "Papas, carne, huevo, frijoles y queso." } },

    // SIDES
    { id: "mexican-rice", cat: "sides", name: "Mexican Rice", nameEs: "Arroz Mexicano", price: 5.99, img: I + "rice.jpg",
      desc: { en: "Seasoned rice cooked with tomatoes, onions & spices.", es: "Arroz sazonado con tomate, cebolla y especias." } },
    { id: "mexican-beans", cat: "sides", name: "Mexican Beans", nameEs: "Frijoles", price: 5.99, img: I + "beans.jpg",
      desc: { en: "Creamy mashed beans with crumbled cheese, cilantro & lime.", es: "Frijoles cremosos con queso desmoronado, cilantro y limón." } },

    // DRINKS
    { id: "horchata", cat: "drinks", name: "Agua de Horchata", price: 5.99, img: I + "horchata.jpg", badges: ["popular"],
      desc: { en: "32 oz · sweet rice & cinnamon", es: "32 oz · arroz y canela" } },
    { id: "jamaica", cat: "drinks", name: "Agua de Jamaica", price: 5.99, img: I + "jamaica.jpg",
      desc: { en: "32 oz · hibiscus", es: "32 oz · flor de jamaica" } },
    { id: "cucumber-lime", cat: "drinks", name: "Cucumber Lime Refresher", nameEs: "Agua de Pepino con Limón", price: 5.99, img: I + "cucumber-lime.jpg", badges: ["popular"],
      desc: { en: "32 oz · fresh & cool", es: "32 oz · fresca y ligera" } },
    { id: "jarritos-pineapple", cat: "drinks", name: "Jarritos Pineapple", nameEs: "Jarritos Piña", price: 3.99,
      desc: { en: "Mexican soda", es: "Refresco mexicano" } },
    { id: "jarritos-lime", cat: "drinks", name: "Jarritos Lime", nameEs: "Jarritos Limón", price: 3.99, img: I + "jarritos-lime.jpg",
      desc: { en: "Mexican soda", es: "Refresco mexicano" } },
    { id: "jarritos-mandarin", cat: "drinks", name: "Jarritos Mandarín", price: 3.99, img: I + "jarritos-mandarin.jpg",
      desc: { en: "Mexican soda", es: "Refresco mexicano" } },
    { id: "sidral-mundet", cat: "drinks", name: "Sidral Mundet", price: 3.99,
      desc: { en: "Apple soda", es: "Refresco de manzana" } },
    { id: "coca-cola", cat: "drinks", name: "Coca-Cola", price: 5.00, img: I + "coca-cola.jpg",
      desc: { en: "500 mL glass bottle", es: "Botella de vidrio 500 mL" } },
    { id: "diet-coke", cat: "drinks", name: "Diet Coke", price: 2.19, img: I + "diet-coke.jpg",
      desc: { en: "Can", es: "Lata" } }
  ];

  root.MENU_DATA = { MEATS: MEATS, MEATS_ES: MEATS_ES, OPTIONS: OPTIONS, CATEGORIES: CATEGORIES, ITEMS: ITEMS };
})(typeof window !== "undefined" ? window : globalThis);
