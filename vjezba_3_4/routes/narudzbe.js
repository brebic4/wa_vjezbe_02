import express from "express";
import { pizze } from "./pizze.js";
const router = express.Router();

let narudzbe = [];
let id = 0;

router.post("/naruci", (req, res) => {
  let zahtjev = { id: id }; //dodavanje id-a u zahtjev za rutu dohvaćanje i brisanje narudžbi po ID-u
  id++;
  zahtjev = { ...zahtjev, ...req.body };
  const kljuceviZahtjev = Object.keys(zahtjev);

  //PROVJERA PODATAKA NARUDZBE
  if (!kljuceviZahtjev.includes("narudzba")) {
    return res.status(400).send("Ne postoje podaci o narudzbi!");
  } else {
    const narudzba = zahtjev["narudzba"];
    for (const stavka of narudzba) {
      const kljucevi = Object.keys(stavka);
      const dozvoljeniKljucevi = ["pizza", "velicina", "kolicina"];

      const postojeKljucevi = kljucevi.every((kljuc) =>
        dozvoljeniKljucevi.includes(kljuc)
      );

      if (!postojeKljucevi || kljucevi.length != 3) {
        return res
          .status(400)
          .send("Nisu poslani svi potrebni podaci o narudzbi!");
      }
    }
  }

  //PROVJERA PODATAKA KLIJENTA
  if (!kljuceviZahtjev.includes("klijent")) {
    return res.status(400).send("Ne postoje podaci o klijentu!");
  } else {
    const klijent = zahtjev["klijent"];
    const kljucevi = Object.keys(klijent);
    const dozvoljeniKljucevi = ["prezime", "adresa", "broj_telefona"];

    //provjera kljuceva
    const postojeKljucevi = kljucevi.every((kljuc) =>
      dozvoljeniKljucevi.includes(kljuc)
    );

    if (!postojeKljucevi || kljucevi.length != 3) {
      return res
        .status(400)
        .send("Nisu poslani svi potrebni podaci o klijentu!");
    }
  }

  // AKO JE SVE U REDU, VRATI ODGOVOR KORISNIKU
  const narudzba = zahtjev["narudzba"];
  const klijent = zahtjev["klijent"];
  let ispis = "Vaša narudžba za ";

  //izracun ukupne cijene
  let ukupna_cijena = 0.0;
  for (const stavka of narudzba) {
    const trazenaPizza = pizze.find((pizza) => pizza.naziv == stavka.pizza);

    ukupna_cijena += trazenaPizza.cijena * stavka.kolicina;
  }

  // unos u message do zadnje stavke da se kontrolira zarez na kraju
  for (let i = 0; i < narudzba.length - 1; i++) {
    ispis += narudzba.at(i).pizza + "(" + narudzba.at(i).velicina + "), ";
  }

  //unos zadnje stavke
  ispis +=
    narudzba.at(narudzba.length - 1).pizza +
    "(" +
    narudzba.at(narudzba.length - 1).velicina +
    ") je uspješno zaprimljena!";

  narudzbe.push(zahtjev);

  res.status(200).json({
    message: ispis,
    prezime: klijent.prezime,
    adresa: klijent.adresa,
    ukupna_cijena: ukupna_cijena,
  });
});

router.get("/", (req, res) => {
  res.status(200).json(narudzbe);
});

router.get("/:id", (req, res) => {
  const id_narudzba = req.params.id;
  const trazenaNarudzba = narudzbe.find((stavka) => stavka.id == id_narudzba);

  if (trazenaNarudzba) {
    res.status(200).json(trazenaNarudzba);
  } else {
    res.status(404).json({ message: "Narudzba sa traženim ID-em ne postoji!" });
  }
});

router.delete("/:id", (req, res) => {
  const id_narudzba = req.params.id;

  const index = narudzbe.findIndex((narudzba) => narudzba.id == id_narudzba);

  if (index != -1) {
    narudzbe.splice(index, 1);
    return res
      .status(200)
      .json({ message: `Narudzba id: ${id_narudzba} uspješno obrisana!` });
  } else {
    return res
      .status(404)
      .json({ message: "Ne postoji pizza straženim ID-em." });
  }
});

export default router;
