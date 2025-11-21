import express from "express";
import { nekretnine } from "./nekretnine.js";
const router = express.Router();

let ponude = [];

//dohvati sve ponude
router.get("/", (req, res) => {
  res.status(200).json(ponude);
});

//pošalji novu ponudu
router.post("/", (req, res) => {
  const ponuda = req.body;
  const kljucevi = Object.keys(ponuda);
  const dozvoljeniKljucevi = [
    "id_nekretnine",
    "ime",
    "prezime",
    "cijena",
    "broj_telefona",
  ];

  const postojeKljucevi = kljucevi.every((kljuc) =>
    dozvoljeniKljucevi.includes(kljuc)
  );

  if (!postojeKljucevi || kljucevi.length != 5) {
    return res
      .status(400)
      .json({ message: "Ponuda ne sadrži sve informacije!" });
  }

  if (isNaN(ponuda.id_nekretnine) || isNaN(ponuda.cijena)) {
    return res
      .status(400)
      .json({ message: "id i cijena moraju biti brojevi!" });
  }

  if (ponuda.cijena < 0) {
    return res.status(400).json({ message: "Cijena ne smije biti negativna!" });
  }

  const postoji = nekretnine.find(
    (nekretnina) => nekretnina.id == ponuda.id_nekretnine
  );

  if (!postoji) {
    return res
      .status(404)
      .json({ message: "Nekretnina sa traženim id-em ne postoji!" });
  }

  let novi_id = 1;
  if (ponude.length != 0) {
    novi_id = ponude.length + 1;
  }

  const novaPonuda = {
    id: novi_id,
    id_nekretnine: ponuda.id_nekretnine,
    ime: ponuda.ime,
    prezime: ponuda.prezime,
    cijena: ponuda.cijena,
    broj_telefona: ponuda.broj_telefona,
  };

  ponude.push(novaPonuda);
  res
    .status(201)
    .json({ message: "Ponuda uspješno dodana!", ponuda: novaPonuda });
});

export default router;
