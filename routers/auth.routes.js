import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import User from '../models/User.js';
import verifyToken from '../middlewares/verifyToken.js';
import multer from 'multer';
import cloudinary from '../cloudinary.js';

const router = express.Router();

//peso massimo file di pic profilo 3mb
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 3 * 1024 * 1024 } 
});

const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    stream.end(fileBuffer);
  });
};

// registrazione 
router.post('/signup', upload.single('image'), async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    let imageUrl = null;
    if (req.file) {
      const result = await streamUpload(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const newUser = new User({
      email,
      password,
      name,
      role: role ? role : 'user',
      image: imageUrl
    });

    await newUser.save();
    
    res.status(201).json({ message: 'Utente registrato correttamente', user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// autenticazione con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback per Google OAuth
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.redirect(`${process.env.CLIENT_URL}/index.html?token=${token}`);
  }
);

export default router;
