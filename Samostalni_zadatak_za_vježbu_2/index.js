import express from "express";
import nekretnineRouter from "./routes/nekretnine.js";
import ponudeRouter from "./routes/ponude.js";

const app = express();
app.use(express.json());
const PORT = 3000;

app.use("/nekretnine", nekretnineRouter);
app.use("/ponude", ponudeRouter);

//Pocetna ruta
app.get("/", (req, res) => {
  res.send("<h1>Dobrodošli u API za agenciju za nekretnine!</h1>");
});

app.listen(PORT, (error) => {
  if (error) {
    console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
  } else {
    console.log(`Server je pokrenut na http://localhost:${PORT}`);
  }
});
