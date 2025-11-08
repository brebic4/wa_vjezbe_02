import express from "express";
const router = express.Router();

// defaultna nekretnina
export let nekretnine = [
  {
    id: 1,
    naziv: "Stan u centru",
    opis: "Prostrani stan s pogledom na grad",
    cijena: 120000.0,
    lokacija: "Zagreb",
    brojSoba: 3,
    povrsina: 80.0,
  },
];

//dohvati sve nekretnine
router.get("/", (req, res) => {
  return res.status(200).json(nekretnine);
});

//dohvati nekretninu po id-u
router.get("/:id", (req, res) => {
  const id_nekretnina = req.params.id;

  if (isNaN(id_nekretnina)) {
    return res.status(400).json({ message: "ID mora biti broj!" });
  }

  const index = nekretnine.findIndex(
    (nekretnina) => nekretnina.id == id_nekretnina
  );

  if (index != -1) {
    return res.status(200).json(nekretnine[index]);
  } else {
    return res
      .status(404)
      .json({ message: "Nekretnina sa traženim id-em ne postoji!" });
  }
});

//dodaj novu nekretninu
router.post("/", (req, res) => {
  let nekretnina = req.body;
  const kljucevi = Object.keys(nekretnina);

  if (
    !(
      kljucevi.includes("naziv") &&
      kljucevi.includes("opis") &&
      kljucevi.includes("cijena") &&
      kljucevi.includes("lokacija") &&
      kljucevi.includes("brojSoba") &&
      kljucevi.includes("povrsina")
    )
  ) {
    return res.status(400).json({ message: "Nedostaju podaci nekretnine!" });
  }

  if (
    nekretnina.cijena < 0 ||
    nekretnina.brojSoba < 0 ||
    nekretnina.povrsina <= 0
  ) {
    return res.status(400).json({ message: "Neispravna vrijednost polja!" });
  }

  let novaNekretnina = {};
  if (nekretnine.length != 0) {
    novaNekretnina = { id: nekretnine[nekretnine.length - 1].id + 1 };
  } else {
    novaNekretnina = { id: 1 };
  }
  novaNekretnina = { ...novaNekretnina, ...nekretnina };
  nekretnine.push(novaNekretnina);

  res.status(201).json({
    message: "Nova nekretnina uspješno dodana",
    nekretnina: novaNekretnina,
  });
});

//potpuno ažuriranje
router.put("/:id", (req, res) => {
  const id_nekretnine = req.params.id;
  let nekretnina = req.body;
  const kljucevi = Object.keys(nekretnina);

  if (isNaN(id_nekretnine)) {
    return res.status(400).json({ message: "ID mora biti broj!" });
  }

  const index = nekretnine.findIndex(
    (nekretnina) => nekretnina.id == id_nekretnine
  );
  if (index == -1) {
    return res
      .status(404)
      .json({ message: "Nekretnina sa traženim ID-em nije pronađena!" });
  }

  if (
    !(
      kljucevi.includes("naziv") &&
      kljucevi.includes("opis") &&
      kljucevi.includes("cijena") &&
      kljucevi.includes("lokacija") &&
      kljucevi.includes("brojSoba") &&
      kljucevi.includes("povrsina")
    )
  ) {
    return res.status(400).json({ message: "Nedostaju podaci nekretnine!" });
  }

  if (
    nekretnina.cijena < 0 ||
    nekretnina.brojSoba < 0 ||
    nekretnina.povrsina <= 0
  ) {
    return res.status(400).json({ message: "Neispravna vrijednost polja!" });
  }

  let novaNekretnina = { id: id_nekretnine };
  nekretnine[index] = { ...novaNekretnina, ...nekretnina };
  res
    .status(200)
    .json({ message: "Uspješno ažurirano!", nekretnina: nekretnine[index] });
});

//djelomično ažuriranje
router.patch("/:id", (req, res) => {
  const id_nekretnine = req.params.id;
  let nekretnina = req.body;

  if (isNaN(id_nekretnine)) {
    return res.status(400).json({ message: "ID mora biti broj!" });
  }

  const index = nekretnine.findIndex(
    (nekretnina) => nekretnina.id == id_nekretnine
  );
  if (index == -1) {
    return res
      .status(404)
      .json({ message: "Nekretnina sa traženim ID-em nije pronađena!" });
  }

  if (
    nekretnina.cijena < 0 ||
    nekretnina.brojSoba < 0 ||
    nekretnina.povrsina <= 0
  ) {
    return res.status(400).json({ message: "Neispravna vrijednost polja!" });
  }

  nekretnine[index] = { ...nekretnine[index], ...nekretnina };

  res
    .status(200)
    .json({ message: "Uspješno ažurirano!", nekretnine: nekretnine[index] });
});

//obriši nekretninu
router.delete("/:id", (req, res) => {
  const id_nekretnina = req.params.id;

  if (isNaN(id_nekretnina)) {
    return res.status(400).json({ message: "ID mora biti broj!" });
  }

  const index = nekretnine.findIndex(
    (nekretnina) => nekretnina.id == id_nekretnina
  );
  if (index == -1) {
    return res
      .status(404)
      .json({ message: "Nekretnina sa traženim id-em ne postoji!" });
  }

  nekretnine.splice(index, 1);
  res.status(200).json({
    message: `Nekretnina sa id-em ${id_nekretnina} uspješno obrisana`,
  });
});

export default router;
