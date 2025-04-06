import jwt from "jsonwebtoken";

export const authenticateSession = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "No Autenticado." });

  jwt.verify(TOKEN, process.env.SECRET, (err, user));
};
