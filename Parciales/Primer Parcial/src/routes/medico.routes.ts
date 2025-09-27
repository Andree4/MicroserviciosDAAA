import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Medico } from "../entity/Medico";

const router = Router();
const MedicoRepo = AppDataSource.getRepository(Medico);

router.post("/", async (req, res) => {
  const nuevaEntrada = MedicoRepo.create(req.body);
  const resultado = await MedicoRepo.save(nuevaEntrada);
  res.json(resultado);
});

router.get("/", async (_, res) => {
  const lista = await MedicoRepo.find();
  res.json(lista);
});

router.get("/:id", async (req, res) => {
  const item = await MedicoRepo.findOneBy({ id: Number(req.params.id) });
  res.json(item);
});

router.put("/:id", async (req, res) => {
  await MedicoRepo.update(req.params.id, req.body);
  const actualizado = await MedicoRepo.findOneBy({ id: Number(req.params.id) });
  res.json(actualizado);
});

router.delete("/:id", async (req, res) => {
  await MedicoRepo.delete(req.params.id);
  res.json({ mensaje: "Eliminado correctamente" });
});

export default router;
