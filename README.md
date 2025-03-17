# Express : Atelier Pratique
## API de gestion d'évènementiel
Créer une API REST (en JS ou TS) avec schémas de validation,gestion des statusCode, JWT, ... qui permette de gérer des évènements (thème de votre choix, j'avais fait des évènements autour du développement Web par ex)

### Un évènement est caractérisé par : 
* Id
* Nom
* Description 
* Nombre de places (opt)
* Catégorie (Id + Nom) (One to Many)
* Image (opt)
* Date + Heure de début 
* Date + Heure de fin (doit être > à date de début)
* Un statut d'annulation (par défaut non)
* La personne qui a créé l'event

### Un utilisateur est caractérisé par : 
* Id
* Nom
* Prénom
* Mail
* Mdp
* DateNaissance (opt)

### Une inscription à un évènement  (Many To Many)
* Un utilisateur
* Un évènement
* Le nombre de places prises

### Fonctionnalités attendues, par ordre de priorité 
* Récupérer tous les évènements à venir, des plus proches aux plus lointains (pas obligé d'être connecté donc pas de JWT)
* Permettre de récupérer un évènement via son id et afficher le nombre de places restantes
* Modifier votre méthode getAll afin de filtrer les évènements par catégorie et/ou plage de dates et/ou terme de recherche (pas obligé d'être connecté)
* Permettre à un utilisateur de créer un compte (attention, vous devrez hash le password avant de l'envoyer en db, regardez du côté de https://www.npmjs.com/package/argon2)
* Permettre à l'utilisateur de se connecter : il entre son email et son mdp et vous vérifiez si le mdp entré et égal à celui en db (via argon2) pour l'email reçu. La requête renvoie alors un token JWT contenant l'id de l'utilisateur connecté (https://www.npmjs.com/package/jsonwebtoken)
* Création d'un évènement (l'id de l'utilisateur qui créer l'évènement sera récupéré dans le JWT)
* Modification d'un évènement (uniquement par l'utilisateur qui l'a créé)
* Un utilisateur peut s'inscrire à un évènement (s'il reste de la place) en indiquant le nombre de places qu'il souhaite
(Si vous souhaitez gérer l'image https://www.npmjs.com/package/multer)
