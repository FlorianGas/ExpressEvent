import { DataTypes, Sequelize, Model, ForeignKey } from "sequelize";
import { Event } from "../@types/types"; // Assure-toi que le chemin vers types est correct
import categorieBuilder from "./categorie";
import userBuilder from "./user";

export default (sequelize: Sequelize) => {
  const EventModel = sequelize.define<Event>(
    "event",
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
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      nb_place: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      categorie_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: categorieBuilder(sequelize),  // Associe avec la table des catégories
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      img: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dte_deb: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      dte_fin: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      est_annule: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createur_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: userBuilder(sequelize), // Associe avec l'utilisateur créateur
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "evenement", // Nom de la table dans la base de données
      timestamps: false, // Pas de colonnes createdAt/updatedAt
    }
  );

  // Définir les relations
  EventModel.belongsTo(categorieBuilder(sequelize), {
    foreignKey: "categorie_id",
    as: "categorie", // Peut être utilisé pour accéder à la catégorie d'un événement
  });
  EventModel.belongsTo(userBuilder(sequelize), {
    foreignKey: "createur_id",
    as: "createur", // Accéder à l'utilisateur créateur de l'événement
  });

  return EventModel;
};
