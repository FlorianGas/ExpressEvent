import { Router } from "express"; 
import { DefaultController } from "./controllers/default.controller";
import { UserController } from "./controllers/user.controller";
import {EventController}  from "./controllers/event.controller";
import { CategoryController } from "./controllers/categorie.controller";
import { RegisterController } from "./controllers/inscription.controller";

export const routes = Router().get("/hello/:name", DefaultController.getHello);
//Routes User
routes.get("/user", UserController.getUsers);
routes.post("/user/adduser", UserController.addUser);
routes.delete("/user/:id", UserController.DeleteUser);
routes.put("/updateUser/:id", UserController.UpdateUser);


//Routes event 
routes.get("/event", EventController.getEvent);
routes.post("/event/addevent", EventController.addEvent);
routes.get("/eventbydate", EventController.getEventByDate);
routes.get('/event/:id', EventController.getEventByIdAndPlace );
//Routes Catégories 
routes.get("/category", CategoryController.getCategory);



//Routes inscription
routes.get("/Register", RegisterController.getRegister);

export default routes;