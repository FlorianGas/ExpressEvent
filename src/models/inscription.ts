import { DataTypes, Sequelize, Model, ForeignKey } from "sequelize";
import { Register } from "../@types/types"; // Assure-toi que le chemin vers types est correct
import userBuilder from "./user";
import eventBuilder from "./event";

export default (sequelize: Sequelize) => {
  const InscriptionModel = sequelize.define<Register>(
    "inscription",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: userBuilder(sequelize), // L'utilisateur qui s'inscrit
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: eventBuilder(sequelize), // L'événement auquel l'utilisateur s'inscrit
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      nb_place_prise: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1, // Au moins 1 place doit être prise
        },
      },
    },
    {
      tableName: "inscription", // Nom de la table dans la base de données
      timestamps: false, // Pas de colonnes createdAt/updatedAt
    }
  );

  // Définir les relations
  InscriptionModel.belongsTo(userBuilder(sequelize), {
    foreignKey: "user_id",
    as: "user", // Relation pour récupérer les informations de l'utilisateur
  });

  InscriptionModel.belongsTo(eventBuilder(sequelize), {
    foreignKey: "event_id",
    as: "event", // Relation pour récupérer les informations de l'événement
  });

  return InscriptionModel;
};
