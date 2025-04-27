import express from "express";
import Countdown from "../models/Countdown.js";
import isAdmin from '../middlewares/isAdmin.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

router.use(verifyToken);
//GET Lista countdown
router.get("/", async (req, res, next) => {
    try {
        const countdownList = await Countdown.find().populate({
          path: "rocket",
          select: "name image",
          populate: {
            path: "company",
            select: "name"
          }
        });
        res.status(200).json(countdownList);
    } catch (error) {
        next(error);
    }
});


//GET Singolo countdown
router.get("/:id", async (req, res, next) => {
    try {
        const countdown = await Countdown.findById(req.params.id).populate({
          path: "rocket",
          select: "name image",
          populate: {
            path: "company",
            select: "name"
          }
        });
        if (!countdown) {
            return res.status(404).json({ message: "Countdown non trovato" });
        }
        res.status(200).json(countdown);
    } catch (error) {
        next(error);
    }
});

//POST Reazione countdown (User)
router.post("/:id/reactions", async (req, res) => {
    try {
        const { type } = req.body
        const userId = req.user._id || req.user.id;

        const countdown = await Countdown.findById(req.params.id)
        if(!countdown) return res.status(404).json({message: "Countdown non trovato" })
        
        countdown.reactions.push({ type, user: userId })
        await countdown.save()

        res.status(200).json(countdown.reactions)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }   
})


router.use(isAdmin);
//POST nuovo countdown
router.post("/", async (req, res, next) => {
    try {
        const newCountdown = new Countdown(req.body)
        const savedCountdown = await newCountdown.save()
        res.status(201).json(savedCountdown)
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ error: "Chiave duplicata: countdown già esistente." });
          } else {
            res.status(500).json({ error: error.message });
          }
    }
})



//PATCH modifica countdown
router.patch("/:id", async (req, res, next) => {
    try {
        const updatedCountdown = await Countdown.findByIdAndUpdate( 
            req.params.id,
            req.body,
            { new: true }
        )
        if (!updatedCountdown) {
            return res.status(404).json({ error: "Countdown non trovato" });
        }
        res.json(updatedCountdown);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})


//DELETE elimina countdown
router.delete("/:id", async (req, res, next) => {
    try {
        const deletedCountdown = await Countdown.findByIdAndDelete(req.params.id)
        if (!deletedCountdown) {
            return res.status(404).json({ error: "countdown non trovato" })
        }
        res.json({ message: "Countdown Eliminato"})
    } catch (error) {
        res.status(500).json({ error: error.message})
    }
});


export default router;