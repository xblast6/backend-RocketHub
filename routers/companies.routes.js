import express from "express";
import Company from "../models/Company.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

// GET Lista aziende
router.get("/", async (req, res, next) => {
  try {
    const companiesList = await Company.find();
    res.status(200).json(companiesList);
  } catch (error) {
    next(error);
  }
});

// GET Azienda singola
router.get("/:id", async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Azienda non trovata" });
    }
    res.status(200).json(company);
  } catch (error) {
    next(error);
  }
});

// POST Nuova azienda
router.post("/", isAdmin, async (req, res, next) => {
  try {
    const newCompany = new Company(req.body);
    const savedCompany = await newCompany.save();
    res.status(201).json(savedCompany);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: "Chiave duplicata: azienda già esistente." });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// PATCH Modifica azienda
router.patch("/:id", isAdmin, async (req, res, next) => {
  try {
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCompany) {
      return res.status(404).json({ error: "Azienda non trovata" });
    }
    res.json(updatedCompany);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Elimina azienda
router.delete("/:id", isAdmin, async (req, res, next) => {
  try {
    const deletedCompany = await Company.findByIdAndDelete(req.params.id);
    if (!deletedCompany) {
      return res.status(404).json({ error: "Azienda non trovata" });
    }
    res.json({ message: "Azienda eliminata" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




export default router;
