import express from "express";
import { AppDataSource } from "./data-source";
import medicoRoutes from "./routes/medico.routes";
import * as path from "path";

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

AppDataSource.initialize()
  .then(() => {
    console.log("Conectado a la base de datos");
    app.use("/medico", medicoRoutes);

    app.listen(4000, () => {
      console.log("Servidor corriendo en http://localhost:4000");
    });
  })
  .catch((err) => {
    console.error("Error de conexión:", err);
  });
