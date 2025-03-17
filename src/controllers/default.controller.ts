import { Request , Response } from "express";

export class DefaultController{
    static getHello(req: Request, res:Response){
        const{name} =req.params;

        res.json({value:`Hello ${name}`});
    }
}