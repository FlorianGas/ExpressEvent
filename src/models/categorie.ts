import { DataTypes, Sequelize, Model } from "sequelize";
import { Type } from "../@types/types"; // Assure-toi que le chemin vers types est correct

export default (sequelize: Sequelize) => {
  const CategoryModel = sequelize.define<Type>(
    "categorie",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false, // Le nom de la catégorie ne peut pas être nul
      },
    },
    {
      tableName: "categorie", // Nom de la table dans la base de données
      timestamps: false, // Pas de colonnes createdAt/updatedAt
    }
  );

  return CategoryModel;
};
