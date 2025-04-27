import Countdown from "../models/Countdown.js";

export const nextCountdown = async (req, res, next) => {
  try {
    const now = new Date();
    const next = await Countdown.findOne({
      status: "attivo",
      launchDate: { $gt: now }
    })
      .sort({ launchDate: 1 })
      .populate({
        path: "rocket",
        select: "name image",
        populate: { path: "company", select: "name" }
      });

    if (!next) {
      return res.status(404).json({ message: "Nessun countdown futuro trovato" });
    }
    res.status(200).json(next);
  } catch (err) {
    next(err);
  }
};