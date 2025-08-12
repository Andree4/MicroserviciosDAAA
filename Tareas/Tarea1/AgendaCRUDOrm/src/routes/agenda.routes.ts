import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Agenda } from "../entity/Agenda";

const router = Router();
const agendaRepo = AppDataSource.getRepository(Agenda);

router.post("/", async (req, res) => {
  const nuevaEntrada = agendaRepo.create(req.body);
  const resultado = await agendaRepo.save(nuevaEntrada);
  res.json(resultado);
});

router.get("/", async (_, res) => {
  const lista = await agendaRepo.find();
  res.json(lista);
});

router.get("/:id", async (req, res) => {
  const item = await agendaRepo.findOneBy({ id: Number(req.params.id) });
  res.json(item);
});

router.put("/:id", async (req, res) => {
  await agendaRepo.update(req.params.id, req.body);
  const actualizado = await agendaRepo.findOneBy({ id: Number(req.params.id) });
  res.json(actualizado);
});

router.delete("/:id", async (req, res) => {
  await agendaRepo.delete(req.params.id);
  res.json({ mensaje: "Eliminado correctamente" });
});

export default router;
