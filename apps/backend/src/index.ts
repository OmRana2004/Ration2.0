import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import routes from "./routes/pageRouters"

const app = express();

dotenv.config();

const port = process.env.PORT || 3001

  //MIDDLEWARES
app.use(express.json());
app.use(cors());

        //ROUTES
app.use("/api/v1/", routes);

    //SERVER
app.listen(port, () => {
    console.log(`Server is running on: ${port}`)
})

