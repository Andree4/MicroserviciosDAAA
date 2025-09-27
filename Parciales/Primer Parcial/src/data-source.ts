import "reflect-metadata";
import { DataSource } from "typeorm";
import { Medico } from "C://Tareas Hechas//Microservicios//MicroserviciosDAAA//Parciales//Primer Parcial//src//entity//Medico";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "medicosbd",
  synchronize: true,
  logging: false,
  entities: [Medico],
});
