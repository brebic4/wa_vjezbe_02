import express from "express";
const router = express.Router();

export const pizze = [
  { id: 1, naziv: "Margherita", cijena: 6.5 },
  { id: 2, naziv: "Capricciosa", cijena: 8.0 },
  { id: 3, naziv: "Quattro formaggi", cijena: 10.0 },
  { id: 4, naziv: "Šunka sir", cijena: 7.0 },
  { id: 5, naziv: "Vegetariana", cijena: 9.0 },
];

router.get("/", (req, res) => {
  res.status(200).json(pizze);
});

router.get("/:id", (req, res) => {
  const id_pizza = req.params.id;

  if (isNaN(id_pizza)) {
    res
      .status(400)
      .json({ message: "Proslijedili se parametar id koji nije broj!" });

    return;
  }

  const trazenaPizza = pizze.find((pizza) => pizza.id == id_pizza);

  if (trazenaPizza) {
    res.status(200).json(trazenaPizza);
  } else {
    res.status(404).json({ message: "Pizza s traženim ID-em ne postoji." });
  }
});

router.put("/:id", (req, res) => {
  const id_pizza = req.params.id;
  let nova_pizza = { id: id_pizza };

  nova_pizza = { ...nova_pizza, ...req.body };

  const index = pizze.findIndex((pizza) => pizza.id == id_pizza);

  if (index != -1) {
    pizze[index] = nova_pizza;
    res
      .status(200)
      .json({ message: "Pizza uspjesno ažurirana!", pizza: pizze[index] });
  } else {
    res.status(404).json({ message: "Pizza s traženim ID-em ne postoji." });
  }
});

router.patch("/:id", (req, res) => {
  const id_pizza = req.params.id;
  const nova_pizza = req.body;

  const index = pizze.findIndex((pizza) => pizza.id == id_pizza);

  if (index != -1) {
    pizze[index] = { ...pizze[index], ...nova_pizza };
    //SPREAD OPERATOR ...
    // Uzmi postojeću pizzu (pizze[index]),
    // “raspakiraj” sva njena svojstva u novi objekt,
    // “raspakiraj” i sva polja iz nova_pizza (ona će prepisati postojeća ako imaju isto ime).

    res
      .status(200)
      .json({ message: "Pizza uspjesno ažurirana!", pizza: pizze[index] });
  } else {
    res.status(404).json({ message: "Pizza s traženim ID-em ne postoji." });
  }
});

router.delete("/:id", (req, res) => {
  const id_pizza = req.params.id;
  const index = pizze.findIndex((pizza) => pizza.id == id_pizza);

  if (index != -1) {
    pizze.splice(index, 1);
    res
      .status(200)
      .json({ message: `Pizza id:${index + 1} uspjesno izbrisana.` });
  } else {
    res.status(404).json({ message: "Pizza s traženim ID-em ne postoji." });
  }
});

export default router;
