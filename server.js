import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import session from 'express-session';
import passport from './middlewares/passport.js';
import isAdmin from './middlewares/isAdmin.js';
import verifyToken from './middlewares/verifyToken.js';

// Import rotte
import authRouter from './routers/auth.routes.js';
import companiesRouter from './routers/companies.routes.js';
import uploadRouter from './routers/upload.routes.js';
import rocketsRouter from './routers/rockets.routes.js';
import countdownRouter from './routers/countdown.routes.js';



const server = express();
server.use(express.json());
server.use(cors());

server.use(session({
  secret: process.env.SESSION_SECRET || 'sessionsecret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

server.use(passport.initialize());
server.use(passport.session());

// Rotte libere
server.use('/auth', authRouter);
import { nextCountdown } from './controllers/countdown.controller.js';
server.get('/countdowns/nextCountdown', nextCountdown);
server.use('/rockets', rocketsRouter);
server.use("/countdowns", countdownRouter);


// Rotte protette
server.use('/companies', verifyToken, isAdmin, companiesRouter);
server.use('/upload', verifyToken, isAdmin, uploadRouter);

// gestione degli errori
server.use((err, req, res, next) => {
  console.error("Errore:", err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});


// Avvio server e connessione DB
const PORT = process.env.PORT || 5010;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.info(`🚀 Server avviato su http://localhost:${PORT}`);
  });
});
