import { Request, Response } from "express";
import db from "../models";

export class CategoryController{
    static async getCategory(req:Request , res:Response){
        const result = await db.categorie.findAndCountAll({
            offset:0,
            limit:10,
        });
        res.json(result);
    }
}