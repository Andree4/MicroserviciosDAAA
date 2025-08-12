import express from "express";
import { AppDataSource } from "./data-source";
import agendaRoutes from "./routes/agenda.routes";
import * as path from "path";

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

AppDataSource.initialize()
  .then(() => {
    console.log("📦 Conectado a la base de datos");
    app.use("/agenda", agendaRoutes);

    app.listen(3000, () => {
      console.log("🚀 Servidor corriendo en http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("Error de conexión:", err);
  });
