import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { userId: number };
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
     res.status(403).json({ error: "Accès refusé. Token manquant." });
     return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    req.user = { userId: decoded.userId }; // Ajoute l'id de l'utilisateur à la requête
    next();
  } catch (error) {
    res.status(401).json({ error: "Token invalide ou expiré." });

    return;
  }
};
