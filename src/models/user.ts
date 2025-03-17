import { DataTypes, Sequelize, Model } from "sequelize";
import { User } from "../@types/types"; // Assure-toi que le chemin vers types est correct

export default (sequelize: Sequelize) => {
  const UserModel = sequelize.define<User>(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      prenom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // L'email doit être unique
        validate: {
          isEmail: true, // Validation que la valeur est un email
        },
      },
      mdp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dte_naiss: {
        type: DataTypes.STRING, // Date de naissance sous forme de string
        allowNull: true,
      },
    },
    {
      tableName: "user", // Nom de la table dans la base de données
      timestamps: false, // Pas de colonnes createdAt/updatedAt
    }
  );

  return UserModel;
};
