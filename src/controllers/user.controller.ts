import { Request, Response } from "express";
import db  from "../models";
import argon2 from "argon2";

export class UserController{
 
    static async getUsers(req:Request , res:Response){
        const result =await db.user.findAndCountAll({
            offset:0,
            limit:10,
        });
        res.json(result);
    }
  

    static async addUser(req:Request , res :Response){
        const {nom , prenom , email , mdp , dte_naiss} = req.body;
        //Validation des champ
        if(!nom || !prenom || !email || !mdp ){
            res.status(400).json({error :"Les champs obligatoires doivent être remplis "})
            return;
        }
        try {
            const hashedPassword = await argon2.hash(mdp);
            const newUser = await db.user.create({
                nom,
                prenom,
                email, 
                mdp :hashedPassword , 
                dte_naiss
            });
            res.status(201).json(newUser);
        } catch (error) {
            if(error.name === "SequelizeValidationError"){
                res.status(400).json({
                    error:"Erreur de validation",
                    details:error.errors.map((err) => err.message),
                });
                return;
            }
            console.error("Erreur lors de l'ajout du user :", error);
            res.status(500).json({error: "Erreur lors de l'ajout du user ."});
        }
    }

    static async DeleteUser (req :Request , res:Response){
        const userId = req.params.id;

        try {
            const result = await db.user.destroy({where  :{id: userId}});
            if(result === 0 ){
                res.status(404).json({error: "Utilisateur non trouvé "});
                return
            }
            res.status(200).json({message : "Utilisateur supprimé avec succès"})
        } catch (error) {
                console.error("Erreur lors de la suppression de l'utilisateur :", error);
                res.status(500).json({ error:"Erreur interne du serveur "});
        }
    }

    static async UpdateUser (req:Request , res:Response){
            const userId  = req.params.id;
            const {nom, prenom, email, mdp , dte_naiss}=req.body;
            

            try {
                const user = await db.user.findByPk(userId);
                if (!user) {
                    res.status(404).json({error:"Utilisatuer non trouvé"});
                    return;
                }
                await db.user.update(
                    {nom, prenom, email, mdp , dte_naiss},
                    {where : {id : userId}}
                );

                const UpdatedUser = await db.user.findByPk(userId);
                
                res.status(200).json ({
                    message:"Utilisateur mis à jour avec succès",
                    user: UpdatedUser,
                });
            } catch (error) {
                console.error("Erreur lors de la mise à jour de l'utilisateur ", error);
                res.status(500).json({error :"Erreur interne du serveur "});
            }

    }



}