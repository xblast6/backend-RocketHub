const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    return res.status(403).json({ message: 'Accesso negato: Accesso possibile solo per gli amministratori' });
  };
  
  export default isAdmin;
  