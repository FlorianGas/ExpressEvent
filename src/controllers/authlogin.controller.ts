import { Request, Response } from "express";
import db from "../models"; // Assurez-vous que votre modèle Sequelize est bien défini
import argon2 from "argon2";
import jwt from "jsonwebtoken";

type JwtPayload = {
  userId: number;
};

export class AuthLoginController {
  static async login(req: Request, res: Response) {
    try {
      const { email, mdp } = req.body;

      // Vérifier si l'utilisateur existe
      const user = await db.user.findOne({ where: { email } });
      if (!user) {
         res.status(401).json({ message: "Email ou mot de passe incorrect." });
         return;
      }

      // Vérifier le mot de passe avec Argon2
      const isPasswordValid = await argon2.verify(user.mdp, mdp);
      if (!isPasswordValid) {
         res.status(401).json({ message: "Email ou mot de passe incorrect." });
         return;
      }
      

      // Générer un token JWT
      const token = jwt.sign(
        { userId: user.id } as JwtPayload,
        process.env.JWT_SECRET!,
        { expiresIn: "1h" } // Expiration du token après 1 heure
      );

      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur." });
    }
  }
}
