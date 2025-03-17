import { Model, Sequelize , InferAttributes,  InferCreationAttributes , CreationOptional , ModelStatic, ForeignKey } from "sequelize";

export interface Db{
    sequelize : Sequelize;
    evenement :ModelStatic<Event>;
    categorie :ModelStatic<Type>;
    user : ModelStatic<User>;
    inscription : ModelStatic<Register>;
}
export interface Type extends Model<InferAttributes<Type>, InferCreationAttributes<Type>> {
    id: CreationOptional<number>;
    nom: string;
}

export interface Event extends Model<InferAttributes<Event>,InferCreationAttributes<Event>>{
    id:  CreationOptional<number>;
    nom:string ;
    description:string ;
    nb_place? : number;
    categorie_id:ForeignKey<Type["id"]> ;
    img? : string;
    dte_deb : Date;
    dte_fin :Date;
    est_annule  :CreationOptional<boolean>;
    createur_id  :ForeignKey<User["id"]>;
    inscriptions?: Register[];
}
export interface User extends Model<InferAttributes<User>,InferCreationAttributes<User>>{
    id:  CreationOptional<number>;
    nom:string ;
    prenom:string ;
    email : string;
    mdp:string  ;
    dte_naiss? : string;
    
}

export interface Register extends Model<InferAttributes<Register>,InferCreationAttributes<Register>>{
    id:  CreationOptional<number>;
    user_id:ForeignKey<User["id"]>;
    event_id:ForeignKey<Event["id"]> ;
    nb_place_prise : number;
    
}