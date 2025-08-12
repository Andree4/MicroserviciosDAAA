import "reflect-metadata";
import { DataSource } from "typeorm";
import { Agenda } from "C:/Tareas Hechas/Microservicios/MicroserviciosDAAA/Tareas/Tarea1/AgendaCRUDOrm/src/entity/Agenda";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "1122ffgg",
  database: "agenda_db",
  synchronize: true,
  logging: false,
  entities: [Agenda],
});
