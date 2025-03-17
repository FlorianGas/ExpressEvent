import { Dialect, Sequelize } from "sequelize";
import { Db } from "../@types/types";
import categorieBuilder from "./categorie";
import userBuilder from "./user";
import eventBuilder from "./event";
import inscriptionBuilder from "./inscription";

// Créer une instance de Sequelize avec les variables d'environnement
const sequelize = new Sequelize(
    process.env.DB_NAME!, 
    process.env.DB_USER!, 
    process.env.DB_PDW!, {
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT!, // Utilise la conversion pour s'assurer que c'est un nombre
    dialect: process.env.DB_DIALECT as Dialect,
});

// Définir les modèles en utilisant la fonction builder pour chaque entité
const User = userBuilder(sequelize);
const Category = categorieBuilder(sequelize);
const Event = eventBuilder(sequelize);
const Inscription = inscriptionBuilder(sequelize);

// 🔹 Relation One-To-Many : Catégorie -> Événements
Category.hasMany(Event, { foreignKey: "categorie_id" });
Event.belongsTo(Category, { foreignKey: "categorie_id" });

// 🔹 Relation One-To-Many : Utilisateur (créateur) -> Événements
User.hasMany(Event, { foreignKey: "createur_id" });
Event.belongsTo(User, { foreignKey: "createur_id" });

// 🔹 Relation Many-To-Many : Utilisateurs <-> Événements (via Inscription)
User.belongsToMany(Event, {
    through: Inscription,
    foreignKey: "user_id",
    otherKey: "event_id",
});

Event.belongsToMany(User, {
    through: Inscription,
    foreignKey: "event_id",
    otherKey: "user_id",
});

// 🔹 Relation One-To-Many : Événements -> Inscriptions
Event.hasMany(Inscription, { foreignKey: "event_id", as: "inscriptions" });
Inscription.belongsTo(Event, { foreignKey: "event_id" });

// Exporter l'objet db avec tous les modèles
const db: Db = {
    sequelize,
    categorie: Category,
    evenement: Event,
    user: User,
    inscription: Inscription,
};

export default db;
