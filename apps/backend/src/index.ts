import express from "express";
import routes from "./routes/pageRouters"

const app = express();

app.use(express.json());

app.use("/api/v1/", routes);

app.listen(3001,(() => {
    console.log("Backend is listening on PORT- 3001")
}))