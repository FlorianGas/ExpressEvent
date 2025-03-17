import { Request, Response } from "express";
import db from "../models";

export class RegisterController{
    static async getRegister(req:Request, res:Response){
        const result = await db.inscription.findAndCountAll({
            offset:0,
            limit:10,
        });
        res.json(result);  
    }



}