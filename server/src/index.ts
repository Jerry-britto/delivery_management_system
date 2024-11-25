import * as dotenv from 'dotenv';
import { app } from "./app";
import connectToDb from "./db/index";

dotenv.config()

const PORT: number = parseInt(process.env.PORT || "4000", 10);

connectToDb()
.then(()=>{
  app.listen(PORT,()=>console.log(`Server is running on http://localhost:${PORT}`))
})
.catch((err)=>{
  console.log("MONGODB connection error failed!!",err)
  app.on("error",(error)=>{
      console.log("Not able to connect with db");
      throw error
  })
})


