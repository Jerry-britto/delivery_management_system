import express from "express";
import cors from "cors";
import router from "./routes/route.ts";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api",router);


app.get("/",(_,res)=>{
    res.send("<h1>Server is on</h1>")
})



export { app };
