import express from "express";
import Rocket from "../models/Rocket.js";
import verifyToken from "../middlewares/verifyToken.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

// GET: Tutti i razzi
router.get("/", async (req, res, next) => {
  try {
    const rockets = await Rocket.find().populate('company');
    res.status(200).json(rockets);
  } catch (error) {
    next(error);
  }
});

// GET: Singolo razzo
router.get("/:id", async (req, res, next) => {
  try {
    const rocket = await Rocket.findById(req.params.id).populate('company');
    if (!rocket) {
      return res.status(404).json({ error: "Razzo non trovato" });
    }
    res.status(200).json(rocket);
  } catch (error) {
    next(error);
  }
});

router.use(verifyToken, isAdmin);
// POST Crea razzo
router.post("/", async (req, res, next) => {
  try {
    const newRocket = new Rocket(req.body);
    const savedRocket = await newRocket.save();
    res.status(201).json(savedRocket);
  } catch (err) {
    next(err);
  }
});

// PATCH Modifica razzo
router.patch("/:id", async (req, res, next) => {
  try {
    const updatedRocket = await Rocket.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updatedRocket) {
      return res.status(404).json({ error: "Razzo non trovato" });
    }
    res.json(updatedRocket);
  } catch (err) {
    next(err);
  }
});


// DELETE Elimina razzo
router.delete("/:id", async (req, res, next) => {
  try {
    const deletedRocket = await Rocket.findByIdAndDelete(req.params.id);
    if (!deletedRocket) {
      return res.status(404).json({ error: "Razzo non trovato" });
    }
    res.json({ message: "Razzo eliminato" });
  } catch (err) {
    next(err);
  }
});

export default router;
