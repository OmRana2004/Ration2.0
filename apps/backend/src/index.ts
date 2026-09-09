import express from "express";
import dotenv from "dotenv";
import routes from "./routes/pageRouters"
import cors from "cors";

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

