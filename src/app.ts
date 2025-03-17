import express from "express";
import {routes} from "./routes";
import db from "./models";


db.sequelize.sync();

const app = express();
app.use(express.json());

app.use(routes);
app.listen(3000, () => {
    console.log("listening port 3000");
});