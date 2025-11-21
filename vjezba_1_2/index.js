import express from "express";
const app = express();
app.use(express.json());
const PORT = 3000;

const pizze = [
  { id: 1, naziv: "Margherita", cijena: 6.5 },
  { id: 2, naziv: "Capricciosa", cijena: 8.0 },
  { id: 3, naziv: "Quattro formaggi", cijena: 10.0 },
  { id: 4, naziv: "Šunka sir", cijena: 7.0 },
  { id: 5, naziv: "Vegetariana", cijena: 9.0 },
];

let narudzbe = [];
// POST metoda i slanje podataka

// VJEZBA 1
/*
app.post("/naruci", (req, res) => {
  let narudzba = req.body;
  const dozvoljeniKljucevi = ["pizza", "velicina", "kolicina"];
  //pretvara Object u Array
  if (!Array.isArray(narudzba)) {
    narudzba = [narudzba];
  }

  // provjera kljuceva
  for (const stavka of narudzba) {
    const kljucevi = Object.keys(stavka);

    const postojeKljucevi = kljucevi.every((kljuc) =>
      dozvoljeniKljucevi.includes(kljuc)
    );

    if (!postojeKljucevi || kljucevi.length != 3) {
      return res.status(400).send("Nisu poslani svi potrebni podaci!");
    }

    // provjera pizze
    const postoji = pizze.some(
      (pizza) => pizza.naziv.toLowerCase() == stavka.pizza.toLowerCase()
    );

    if (!postoji) {
      return res
        .status(404)
        .send(`Pizza ${stavka.pizza} ne postoji u jelovniku`);
    }
  }

  console.log("Primljeni podaci: ", narudzba);
  narudzbe.push(narudzba);

  // slanje ispisa pizza korisniku
  let stringNarudzba = narudzba
    .map(
      (stavka) =>
        "Pizza: " +
        stavka.pizza +
        ", Velicina: " +
        stavka.velicina +
        ", Kolicina: " +
        stavka.kolicina
    )
    .join("\n");
  return res
    .status(201)
    .send(`Narudzba uspjesno zaprimljena! \n${stringNarudzba}`);
});
*/
// VJEZBA 2

app.post("/naruci", (req, res) => {
  const zahtjev = req.body;
  const kljuceviZahtjev = Object.keys(zahtjev);

  //PROVJERA PODATAKA NARUDZBE
  if (!kljuceviZahtjev.includes("narudzba")) {
    return res.status(400).send("Ne postoje podaci o narudzbi!");
  } else {
    const narudzba = zahtjev["narudzba"];
    for (const stavka of narudzba) {
      const kljucevi = Object.keys(stavka);
      const dozvoljeniKljucevi = ["pizza", "velicina", "kolicina"];

      //provjera kljuceva
      const postojeKljucevi = kljucevi.every((kljuc) =>
        dozvoljeniKljucevi.includes(kljuc)
      );

      if (!postojeKljucevi || kljucevi.length != 3) {
        return res
          .status(400)
          .send("Nisu poslani svi potrebni podaci o narudzbi!");
      }

      // provjera pizze
      const postoji = pizze.some(
        (pizza) => pizza.naziv.toLowerCase() == stavka.pizza.toLowerCase()
      );

      if (!postoji) {
        return res
          .status(404)
          .send(`Pizza ${stavka.pizza} ne postoji u jelovniku`);
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

  res.status(201).json({
    message: ispis,
    prezime: klijent.prezime,
    adresa: klijent.adresa,
    ukupna_cijena: ukupna_cijena,
  });
});

app.listen(PORT, (error) => {
  if (error) {
    console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
  } else {
    console.log(`Server je pokrenut na http://localhost:${PORT}`);
  }
});
