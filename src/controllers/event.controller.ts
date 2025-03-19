import { Request, Response } from "express";
import db from "../models";
import { Op, Sequelize } from "sequelize";
import { error } from "console";
import { AuthRequest } from "../middlewares/authentification.middleware";
export  class EventController {
    static async getEvent(req:Request , res:Response){

        const result = await db.evenement.findAndCountAll({
            offset:0,
            limit:10, 

        });
        res.json(result);
    }

    static async getEventByDate(req:Request, res:Response){
         const today = new Date();
         const upcomingEvent = await db.evenement.findAndCountAll({
            where:{
                dte_deb:{
                    [Op.gte] :today,
                }
            }, 
            order:[
                ["dte_deb", "ASC"]
            ]
         });

        res.status(200).json(upcomingEvent);

    }
    
    static async getEventByIdAndPlace(req: Request, res: Response) {
        const id = Number(req.params.id);
    
        if (isNaN(id)) {
            res.status(400).json({ error: "ID de l'événement invalide" });
            return;
        }
    
        try {
            const event = await db.evenement.findByPk(id, {
                include: [{
                    model: db.inscription,
                    as: 'inscriptions', // Assurez-vous que cette relation existe bien dans votre db.ts
                }],
            });
    
            if (!event) {
                 res.status(404).json({ error: "Événement non trouvé" });
                 return;
            }
    
            // Vérifier si inscriptions existe avant d'utiliser reduce
            const inscriptions = event.inscriptions || []; // Si 'inscriptions' est undefined, on le remplace par un tableau vide
            const placesPrises = inscriptions.reduce((acc, ins) => acc + ins.nb_place_prise, 0);
            const placesRestantes = Math.max((event.nb_place ?? 0) - placesPrises, 0);
    
            res.status(200).json({ event, placesRestantes });
        } catch (error) {
            console.error("Erreur lors de la récupération de l'événement :", error);
            res.status(500).json({ error: "Erreur serveur." });
        }
    }
    
   
    static async addEvent (req:AuthRequest , res:Response){

        console.log("Connexion active ?", db.sequelize ? "Oui" : "Non");

        const {nom,description,nb_place,categorie_id,img,dte_deb,dte_fin,est_annule,createur_id	} = req.body;
        if (!nom || !description || !categorie_id ||!dte_deb || !dte_fin || !createur_id)
        {
            res.status(400).json({error:"Les champs obligatoires ne sont pas remplis "});
            return;
        }
        try {
            const newEvent =await db.evenement.create({
                nom, 
                description,
                nb_place,   
                categorie_id, 
                img, 
                dte_deb, 
                dte_fin, 
                est_annule, 
                createur_id 
            });
            res.status(201).json(newEvent);
        } catch (error) {
            if(error.name === "SequelizeValidationError"){
                res.status(400).json({
                    error:"Erreur de validaiton",
                    details:error.errors.map((err) => err.message),
                });
                return
            }
            console.error("Erreur lors de 'lajout de l'évenement :", error);
            res.status(500).json({error:"Erreur lors de l'ajout de l'event ."})
            
            
        }

    }
    static async addEventAuth(req: AuthRequest, res: Response) {
        console.log("Connexion active ?", db.sequelize ? "Oui" : "Non");
    
        // Récupérer l'ID du créateur depuis le JWT
        if (!req.user) {
           res.status(401).json({ error: "Utilisateur non authentifié." });
           return;
        }
        const createur_id = req.user.userId;
    
        const { nom, description, nb_place, categorie_id, img, dte_deb, dte_fin, est_annule } = req.body;
    
        if (!nom || !description || !categorie_id || !dte_deb || !dte_fin) {
           res.status(400).json({ error: "Les champs obligatoires ne sont pas remplis." });
           return
        }
    
        try {
          const newEvent = await db.evenement.create({
            nom,
            description,
            nb_place,
            categorie_id,
            img,
            dte_deb,
            dte_fin,
            est_annule,
            createur_id, 
          });
    
          res.status(201).json({
            message: "Événement créé avec succès.",
            event: newEvent,
          });
        } catch (error: any) {
          if (error.name === "SequelizeValidationError") {
             res.status(400).json({
              error: "Erreur de validation",
              details: error.errors.map((err: any) => err.message),
            });
            return
          }
    
          console.error("Erreur lors de l'ajout de l'événement :", error);
          res.status(500).json({ error: "Erreur lors de l'ajout de l'événement." });
        }
      }
      static async updateEvent(req: AuthRequest, res: Response) {
        try {
          // Vérifier si l'utilisateur est authentifié
          if (!req.user) {
             res.status(401).json({ error: "Utilisateur non authentifié." });
             return;
          }
          const userId = req.user.userId;
          const eventId = req.params.id;
    
          // Trouver l'événement
          const event = await db.evenement.findByPk(eventId);
          if (!event) {
             res.status(404).json({ error: "Événement non trouvé." });
             return;
          }
    
          // Vérifier si l'utilisateur est bien le créateur
          if (event.createur_id !== userId) {
             res.status(403).json({ error: "Accès refusé. Vous n'êtes pas le créateur de cet événement." });
             return;
          }
    
          // Mettre à jour l'événement
          const { nom, description, nb_place, categorie_id, img, dte_deb, dte_fin, est_annule } = req.body;
          await event.update({ nom, description, nb_place, categorie_id, img, dte_deb, dte_fin, est_annule });
    
           res.status(200).json({ message: "Événement mis à jour avec succès.", event });
           return;
        } catch (error) {
          console.error("Erreur lors de la mise à jour de l'événement :", error);
           res.status(500).json({ error: "Erreur lors de la mise à jour de l'événement." });
           return;
        }
      }
}
